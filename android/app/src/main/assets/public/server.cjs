var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
var PORT = 3e3;
function pcmToWavBuffer(pcmBuffer, sampleRate = 24e3, numChannels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
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
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const cleanedText = text.replace(/<[^>]*>/g, " ").replace(/[*_#`~[\]()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 3500);
      const selectedVoice = voiceName || (lang === "ar" ? "Zephyr" : lang === "ur" ? "Kore" : "Kore");
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: cleanedText }] }],
        config: {
          responseModalities: [import_genai.Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice }
            }
          }
        }
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
        const pcmBuffer = Buffer.from(rawBase64, "base64");
        const wavBuffer = pcmToWavBuffer(pcmBuffer, 24e3, 1, 16);
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
    } catch (err) {
      console.error("Express TTS API Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI Voice",
        fallbackToClientSpeech: true
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
