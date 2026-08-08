/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { VoiceReaderSettings } from '../types';

export const DEFAULT_FIRESTORE_VOICE_SETTINGS: VoiceReaderSettings = {
  globalEnabled: true,
  defaultVoiceUr: 'ur-PK',
  defaultVoiceAr: 'ar-SA',
  defaultVoiceEn: 'en-US',
  defaultSpeed: 1.0,
  defaultVolume: 1.0,
  autoLanguageDetection: true,
  enabled: true,
  defaultVoice: 'auto',
  readingSpeed: 1.0,
  volume: 1.0,
  honorificPronunciation: true,
  cacheAudio: true
};

/**
 * Fetches top-level Firestore document "settings/voiceReader"
 */
export async function getVoiceReaderSettings(): Promise<VoiceReaderSettings> {
  try {
    const docRef = doc(db, 'settings', 'voiceReader');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<VoiceReaderSettings>;
      return {
        ...DEFAULT_FIRESTORE_VOICE_SETTINGS,
        ...data
      };
    }
  } catch (error) {
    console.warn('Firestore getVoiceReaderSettings note:', error);
  }

  return DEFAULT_FIRESTORE_VOICE_SETTINGS;
}

/**
 * Updates top-level Firestore document "settings/voiceReader"
 */
export async function updateVoiceReaderSettings(settings: Partial<VoiceReaderSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'voiceReader');
  await setDoc(docRef, settings, { merge: true });
}

/**
 * Uploads an admin human recording MP3 for a post to Firebase Storage
 * under path: audio/official/{postId}.mp3
 * and sets long HTTP cacheControl headers ("public, max-age=604800") so browsers
 * cache the audio file for 7 days, avoiding repeated network downloads.
 * Updates the post document in Firestore with officialAudioUrl and humanVoiceUrl.
 */
export async function uploadOfficialAudio(postId: string, file: File): Promise<string> {
  if (!postId || !file) {
    throw new Error('Valid postId and audio File are required for upload');
  }

  const storagePath = `audio/official/${postId}.mp3`;
  const storageRef = ref(storage, storagePath);

  // Upload file bytes to Firebase Storage with 7-day browser HTTP caching
  await uploadBytes(storageRef, file, {
    contentType: file.type || 'audio/mp3',
    cacheControl: 'public, max-age=604800'
  });

  // Get public download URL
  const downloadUrl = await getDownloadURL(storageRef);

  // Update post document in Firestore
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      officialAudioUrl: downloadUrl,
      humanVoiceUrl: downloadUrl
    });
  } catch (err) {
    console.warn('Updated storage file, note on updating Firestore post doc:', err);
  }

  return downloadUrl;
}

/**
 * Removes the official human audio recording for a post from Firebase Storage
 * and clears the URL fields on the post document in Firestore.
 */
export async function removeOfficialAudio(postId: string): Promise<void> {
  if (!postId) return;

  const storagePath = `audio/official/${postId}.mp3`;
  const storageRef = ref(storage, storagePath);

  // Delete from Firebase Storage if it exists
  try {
    await deleteObject(storageRef);
  } catch (err: any) {
    // Ignore error if object does not exist in storage
    if (err?.code !== 'storage/object-not-found') {
      console.warn('Note deleting storage object:', err);
    }
  }

  // Clear officialAudioUrl and humanVoiceUrl on post document in Firestore
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      officialAudioUrl: '',
      humanVoiceUrl: ''
    });
  } catch (err) {
    console.warn('Note updating Firestore post document on audio removal:', err);
  }
}
