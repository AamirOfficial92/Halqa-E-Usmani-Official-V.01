/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VoiceReaderSettings } from '../types';
import { getVoiceReaderSettings, DEFAULT_FIRESTORE_VOICE_SETTINGS } from '../lib/firestoreVoiceReader';
import { voiceReaderEngine, PlaybackState } from '../lib/voiceReaderEngine';

export interface VoiceReaderContextType {
  settings: VoiceReaderSettings;
  loading: boolean;
  currentlyPlayingPostId: string | null;
  setCurrentlyPlaying: (postId: string | null) => void;
  activePostId: string | null;
  setActivePostId: (postId: string | null) => void;
  stopActivePlayback: () => void;
  engineState: PlaybackState;
}

const VoiceReaderContext = createContext<VoiceReaderContextType>({
  settings: DEFAULT_FIRESTORE_VOICE_SETTINGS,
  loading: true,
  currentlyPlayingPostId: null,
  setCurrentlyPlaying: () => {},
  activePostId: null,
  setActivePostId: () => {},
  stopActivePlayback: () => {},
  engineState: voiceReaderEngine.getState()
});

export const VoiceReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceReaderSettings>(DEFAULT_FIRESTORE_VOICE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentlyPlayingPostId, setCurrentlyPlayingPostIdState] = useState<string | null>(null);
  const [engineState, setEngineState] = useState<PlaybackState>(voiceReaderEngine.getState());

  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      try {
        const data = await getVoiceReaderSettings();
        if (isMounted) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Note: VoiceReaderProvider failed to fetch Firestore settings:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with singleton voiceReaderEngine state across the app
  useEffect(() => {
    const unsubscribe = voiceReaderEngine.subscribe((state) => {
      setEngineState(state);
      if (state.isPlaying || state.isPaused) {
        setCurrentlyPlayingPostIdState(state.activePostId);
      } else if (!state.activePostId) {
        setCurrentlyPlayingPostIdState(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setCurrentlyPlaying = useCallback((postId: string | null) => {
    setCurrentlyPlayingPostIdState(postId);
  }, []);

  const stopActivePlayback = useCallback(() => {
    voiceReaderEngine.stop();
    setCurrentlyPlayingPostIdState(null);
  }, []);

  return (
    <VoiceReaderContext.Provider 
      value={{ 
        settings, 
        loading, 
        currentlyPlayingPostId, 
        setCurrentlyPlaying,
        activePostId: currentlyPlayingPostId,
        setActivePostId: setCurrentlyPlaying,
        stopActivePlayback,
        engineState
      }}
    >
      {children}
    </VoiceReaderContext.Provider>
  );
};

export const useVoiceReader = () => useContext(VoiceReaderContext);
