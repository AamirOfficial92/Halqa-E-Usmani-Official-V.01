import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

function pcmToWavBuffer(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  // fmt sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Voice / Text-To-Speech API endpoint
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, lang, voiceName } = req.body;
      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Text content is required for speech synthesis" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured on the server.",
          fallbackToClientSpeech: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare text for speech
      const cleanedText = text
        .replace(/<[^>]*>/g, " ")
        .replace(/[*_#`~[\]()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3500); // limit per chunk for fast streaming response

      // Select voice: 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'
      const selectedVoice = voiceName || (lang === "ar" ? "Zephyr" : lang === "ur" ? "Kore" : "Kore");

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: cleanedText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const candidate = response.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      if (!part || !part.inlineData || !part.inlineData.data) {
        return res.status(500).json({
          error: "Gemini TTS returned no audio data",
          fallbackToClientSpeech: true
        });
      }

      const rawBase64 = part.inlineData.data;
      let mimeType = part.inlineData.mimeType || "audio/wav";

      let finalBase64 = rawBase64;
      if (mimeType.includes("pcm") || mimeType.includes("raw") || !mimeType.includes("audio/")) {
        // Wrap raw PCM buffer with a standard 24kHz 16-bit WAV header
        const pcmBuffer = Buffer.from(rawBase64, "base64");
        const wavBuffer = pcmToWavBuffer(pcmBuffer, 24000, 1, 16);
        finalBase64 = wavBuffer.toString("base64");
        mimeType = "audio/wav";
      }

      const audioUrl = `data:${mimeType};base64,${finalBase64}`;
      return res.json({
        success: true,
        audioUrl,
        voiceName: selectedVoice,
        lang
      });
    } catch (err: any) {
      console.error("Express TTS API Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI Voice",
        fallbackToClientSpeech: true
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
