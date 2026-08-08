import { 
  collection, 
  doc,
  addDoc, 
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs, 
  onSnapshot,
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db, auth, storage, messaging } from './firebase';
import { PostSplashScreenItem, 
  Post, 
  Category, 
  PDFBook, 
  VideoItem, 
  AudioItem, 
  FeedbackItem, 
  DonationRecord, 
  DonationInitiative,
  AppNotification,
  SliderItem,
  GalleryImage,
  GalleryAlbum,
  InfoPage,
  IslamicEvent,
  DuaItem,
  PostComment,
  ContactInfo,
  SocialLinks,
  AppUser,
  SpiritualPersonality,
  MakhzanPost,
  MakhzanCategory,
  Branch,
  DayDatasetRecord,
  AuditLog,
  SpiritualSlip
} from '../types';

// Authentication Helpers
export const firebaseSignInAnonymously = async (): Promise<User | null> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.warn('Firebase Anonymous Auth error:', error);
    return null;
  }
};

export const adminSignInWithFirebase = async (identifier: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    let email = identifier.trim();
    if (!email.includes('@')) {
      email = `${email.toLowerCase().replace(/[^a-z0-9]/g, '')}@halqausmania.app`;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (signInErr: any) {
      if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential' || signInErr?.code === 'auth/invalid-email') {
        if (email === 'hafizsahab@halqausmania.app' && password === 'Usmani786@') {
          try {
            const newUserCred = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: newUserCred.user };
          } catch (createErr) {
            return { success: false, error: 'Invalid credentials. Please contact the app administrator.' };
          }
        }
      }
      return { success: false, error: 'Invalid credentials. Please contact the app administrator.' };
    }
  } catch (err) {
    return { success: false, error: 'Invalid credentials. Please contact the app administrator.' };
  }
};

export const adminSignOutWithFirebase = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    return false;
  }
};

export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Storage Upload Helper
export const uploadFileToFirebaseStorage = async (file: File, folder = 'uploads'): Promise<string> => {
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.warn('Firebase Storage upload notice, using Data URL fallback:', error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};

// =========================================
// REAL-TIME FIRESTORE SUBSCRIPTIONS
// =========================================

export const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
};

// 1. POSTS REAL-TIME LISTENER & CRUD
export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, 'posts'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Post[];
    callback(dedupeById(posts));
  }, (error) => {
    console.warn('Posts real-time listener error:', error);
  });
};

export const savePostToFirestore = async (post: Post): Promise<boolean> => {
  try {
    const docRef = doc(db, 'posts', post.id);
    const cleanPost = JSON.parse(JSON.stringify(post));
    await setDoc(docRef, { ...cleanPost, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving post to Firestore:', error);
    return false;
  }
};

export const deletePostFromFirestore = async (postId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    console.log(`[Firestore] Successfully deleted post ${postId}`);
    return true;
  } catch (error) {
    console.error('[Firestore Error] Failed to delete post:', error);
    return false;
  }
};

// 2. CATEGORIES REAL-TIME LISTENER & CRUD
export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
  const q = query(collection(db, 'categories'));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Category[];
    callback(dedupeById(categories));
  }, (error) => {
    console.warn('Categories real-time listener error:', error);
  });
};

export const saveCategoryToFirestore = async (category: Category): Promise<boolean> => {
  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(category)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving category to Firestore:', error);
    return false;
  }
};

export const deleteCategoryFromFirestore = async (categoryId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    return true;
  } catch (error) {
    console.warn('Error deleting category from Firestore:', error);
    return false;
  }
};

// 3. MEDIA (PDFs, VIDEOS, AUDIOS) REAL-TIME LISTENERS & CRUD
export const subscribeToPDFs = (callback: (pdfs: PDFBook[]) => void) => {
  const q = query(collection(db, 'pdfs'));
  return onSnapshot(q, (snapshot) => {
    const pdfs = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PDFBook[];
    callback(dedupeById(pdfs));
  }, (error) => {
    console.warn('PDFs real-time listener error:', error);
  });
};

export const savePDFToFirestore = async (pdf: PDFBook): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'pdfs', pdf.id), JSON.parse(JSON.stringify(pdf)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving PDF:', error);
    return false;
  }
};

export const deletePDFFromFirestore = async (pdfId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'pdfs', pdfId));
    return true;
  } catch (error) {
    console.warn('Error deleting PDF:', error);
    return false;
  }
};

export const subscribeToVideos = (callback: (videos: VideoItem[]) => void) => {
  const q = query(collection(db, 'videos'));
  return onSnapshot(q, (snapshot) => {
    const videos = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as VideoItem[];
    callback(dedupeById(videos));
  }, (error) => {
    console.warn('Videos real-time listener error:', error);
  });
};

export const saveVideoToFirestore = async (video: VideoItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'videos', video.id), JSON.parse(JSON.stringify(video)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving video:', error);
    return false;
  }
};

export const deleteVideoFromFirestore = async (videoId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'videos', videoId));
    return true;
  } catch (error) {
    console.warn('Error deleting video:', error);
    return false;
  }
};

export const subscribeToAudios = (callback: (audios: AudioItem[]) => void) => {
  const q = query(collection(db, 'audios'));
  return onSnapshot(q, (snapshot) => {
    const audios = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as AudioItem[];
    callback(dedupeById(audios));
  }, (error) => {
    console.warn('Audios real-time listener error:', error);
  });
};

export const saveAudioToFirestore = async (audio: AudioItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'audios', audio.id), JSON.parse(JSON.stringify(audio)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving audio:', error);
    return false;
  }
};

export const deleteAudioFromFirestore = async (audioId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'audios', audioId));
    return true;
  } catch (error) {
    console.warn('Error deleting audio:', error);
    return false;
  }
};

// 4. NOTIFICATIONS REAL-TIME LISTENER & CRUD
export const subscribeToNotifications = (callback: (notifications: AppNotification[]) => void) => {
  const q = query(collection(db, 'notifications'));
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as AppNotification[];
    callback(dedupeById(notifications));
  }, (error) => {
    console.warn('Notifications real-time listener error:', error);
  });
};

export const sendNotificationToFirestore = async (notification: AppNotification) => {
  try {
    await setDoc(doc(db, 'notifications', notification.id), JSON.parse(JSON.stringify({
      ...notification,
      createdAt: new Date().toISOString()
    })), { merge: true });
    return notification.id;
  } catch (error) {
    console.warn('Firestore sendNotification error:', error);
    return null;
  }
};

export const deleteNotificationFromFirestore = async (notifId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'notifications', notifId));
    return true;
  } catch (error) {
    console.warn('Error deleting notification from Firestore:', error);
    return false;
  }
};

// 5. FEEDBACK REAL-TIME LISTENER & CRUD
export const subscribeToFeedback = (callback: (feedback: FeedbackItem[]) => void) => {
  const q = query(collection(db, 'feedback'));
  return onSnapshot(q, (snapshot) => {
    const feedbackList = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as FeedbackItem[];
    callback(dedupeById(feedbackList));
  }, (error) => {
    console.warn('Feedback real-time listener error:', error);
  });
};

export const submitFeedbackToFirestore = async (item: Omit<FeedbackItem, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...item,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore submitFeedback error:', error);
    return null;
  }
};

export const updateFeedbackInFirestore = async (feedbackItem: FeedbackItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'feedback', feedbackItem.id), JSON.parse(JSON.stringify(feedbackItem)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error updating feedback in Firestore:', error);
    return false;
  }
};

export const deleteFeedbackFromFirestore = async (feedbackId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
    return true;
  } catch (error) {
    console.warn('Error deleting feedback from Firestore:', error);
    return false;
  }
};

// 6. DONATIONS REAL-TIME LISTENER & CRUD
export const subscribeToDonations = (callback: (donations: DonationRecord[]) => void) => {
  const q = query(collection(db, 'donations'));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as DonationRecord[];
    callback(dedupeById(records));
  }, (error) => {
    console.warn('Donations real-time listener error:', error);
  });
};

export const submitDonationToFirestore = async (record: Omit<DonationRecord, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), JSON.parse(JSON.stringify({
      ...record,
      createdAt: new Date().toISOString()
    })));
    return docRef.id;
  } catch (error) {
    console.warn('Firestore submitDonation error:', error);
    return null;
  }
};

export const saveDonationRecordToFirestore = async (record: DonationRecord): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'donations', record.id), JSON.parse(JSON.stringify(record)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving donation record to Firestore:', error);
    return false;
  }
};

export const deleteDonationRecordFromFirestore = async (recordId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'donations', recordId));
    return true;
  } catch (error) {
    console.warn('Error deleting donation record from Firestore:', error);
    return false;
  }
};

export const subscribeToDonationInitiatives = (callback: (initiatives: DonationInitiative[]) => void) => {
  const q = query(collection(db, 'donation_initiatives'));
  return onSnapshot(q, (snapshot) => {
    const initiatives = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as DonationInitiative[];
    callback(dedupeById(initiatives));
  }, (error) => {
    console.warn('Donation initiatives real-time listener error:', error);
  });
};

export const saveDonationInitiativeToFirestore = async (initiative: DonationInitiative): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'donation_initiatives', initiative.id), JSON.parse(JSON.stringify(initiative)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving donation initiative to Firestore:', error);
    return false;
  }
};

export const deleteDonationInitiativeFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'donation_initiatives', id));
    return true;
  } catch (error) {
    console.warn('Error deleting donation initiative from Firestore:', error);
    return false;
  }
};

export const deleteIslamicEventFromFirestore = async (eventId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'islamic_events', eventId));
    return true;
  } catch (error) {
    console.warn('Error deleting Islamic Event:', error);
    return false;
  }
};

export const deleteDuaFromFirestore = async (duaId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'duas', duaId));
    return true;
  } catch (error) {
    console.warn('Error deleting Dua:', error);
    return false;
  }
};

export const saveContactInfoToFirestore = async (contact: ContactInfo): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'settings', 'contactInfo'), JSON.parse(JSON.stringify(contact)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Contact Info to Firestore:', error);
    return false;
  }
};

export const saveSocialLinksToFirestore = async (social: SocialLinks): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'settings', 'socialLinks'), JSON.parse(JSON.stringify(social)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Social Links to Firestore:', error);
    return false;
  }
};

// 7. SLIDERS REAL-TIME LISTENER & CRUD
export const subscribeToSliders = (callback: (sliders: SliderItem[]) => void) => {
  const q = query(collection(db, 'sliders'));
  return onSnapshot(q, (snapshot) => {
    const sliders = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as SliderItem[];
    callback(dedupeById(sliders));
  }, (error) => {
    console.warn('Sliders real-time listener error:', error);
  });
};

export const saveSliderToFirestore = async (slider: SliderItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'sliders', slider.id), JSON.parse(JSON.stringify(slider)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving slider to Firestore:', error);
    return false;
  }
};

export const deleteSliderFromFirestore = async (sliderId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'sliders', sliderId));
    return true;
  } catch (error) {
    console.warn('Error deleting slider from Firestore:', error);
    return false;
  }
};

// 8. GALLERY IMAGES REAL-TIME LISTENER & CRUD
export const subscribeToGalleryImages = (callback: (images: GalleryImage[]) => void) => {
  const q = query(collection(db, 'gallery'));
  return onSnapshot(q, (snapshot) => {
    const images = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as GalleryImage[];
    callback(dedupeById(images));
  }, (error) => {
    console.warn('Gallery real-time listener error:', error);
  });
};

export const saveGalleryImageToFirestore = async (img: GalleryImage): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'gallery', img.id), JSON.parse(JSON.stringify(img)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving gallery image to Firestore:', error);
    return false;
  }
};

export const deleteGalleryImageFromFirestore = async (imgId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'gallery', imgId));
    return true;
  } catch (error) {
    console.warn('Error deleting gallery image from Firestore:', error);
    return false;
  }
};

// 8b. GALLERY ALBUMS REAL-TIME LISTENER & CRUD
export const subscribeToAlbums = (callback: (albums: GalleryAlbum[]) => void) => {
  const q = query(collection(db, 'albums'));
  return onSnapshot(q, (snapshot) => {
    const albums = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as GalleryAlbum[];
    callback(dedupeById(albums));
  }, (error) => {
    console.warn('Albums real-time listener error:', error);
  });
};

export const saveAlbumToFirestore = async (album: GalleryAlbum): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'albums', album.id), JSON.parse(JSON.stringify(album)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving album to Firestore:', error);
    return false;
  }
};

export const deleteAlbumFromFirestore = async (albumId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'albums', albumId));
    return true;
  } catch (error) {
    console.warn('Error deleting album from Firestore:', error);
    return false;
  }
};

// 11. ISLAMIC EVENTS & DUAS REAL-TIME LISTENERS
export const subscribeToIslamicEvents = (callback: (events: IslamicEvent[]) => void) => {
  const q = query(collection(db, 'islamic_events'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as IslamicEvent[];
    callback(dedupeById(events));
  }, (error) => {
    console.warn('Islamic Events listener error:', error);
  });
};

export const saveIslamicEventToFirestore = async (event: IslamicEvent): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'islamic_events', event.id), JSON.parse(JSON.stringify(event)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Islamic Event:', error);
    return false;
  }
};

export const subscribeToDuas = (callback: (duas: DuaItem[]) => void) => {
  const q = query(collection(db, 'duas'));
  return onSnapshot(q, (snapshot) => {
    const duas = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as DuaItem[];
    callback(dedupeById(duas));
  }, (error) => {
    console.warn('Duas listener error:', error);
  });
};

export const saveDuaToFirestore = async (dua: DuaItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'duas', dua.id), JSON.parse(JSON.stringify(dua)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Dua:', error);
    return false;
  }
};

// 12. POST COMMENTS & ENGAGEMENT
export const subscribeToPostComments = (postId: string, callback: (comments: PostComment[]) => void) => {
  const q = query(collection(db, 'posts', postId, 'comments'));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PostComment[];
    callback(dedupeById(comments));
  }, (error) => {
    console.warn('Comments listener error:', error);
  });
};

export const addCommentToFirestore = async (comment: Omit<PostComment, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'posts', comment.postId, 'comments'), JSON.parse(JSON.stringify({
      ...comment,
      createdAt: new Date().toISOString()
    })));
    return docRef.id;
  } catch (error) {
    console.warn('Error adding comment:', error);
    return null;
  }
};

// 10. INFORMATION PAGES REAL-TIME LISTENER & CRUD
export const subscribeToInfoPages = (callback: (pages: InfoPage[]) => void) => {
  const q = query(collection(db, 'info_pages'));
  return onSnapshot(q, (snapshot) => {
    const pages = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as InfoPage[];
    callback(dedupeById(pages));
  }, (error) => {
    console.warn('InfoPages real-time listener error:', error);
  });
};

export const saveInfoPageToFirestore = async (page: InfoPage): Promise<boolean> => {
  try {
    const docRef = doc(db, 'info_pages', page.id);
    await setDoc(docRef, JSON.parse(JSON.stringify({ ...page, updatedAt: new Date().toISOString() })), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving info page to Firestore:', error);
    return false;
  }
};

export const deleteInfoPageFromFirestore = async (pageId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'info_pages', pageId));
    return true;
  } catch (error) {
    console.warn('Error deleting info page from Firestore:', error);
    return false;
  }
};

// BRANCHES FIRESTORE SERVICES ('branches')
export const subscribeToBranches = (callback: (branches: Branch[]) => void) => {
  const q = query(collection(db, 'branches'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Branch[];
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Branches real-time listener error:', error);
  });
};

export const saveBranchToFirestore = async (branch: Branch): Promise<boolean> => {
  try {
    const docRef = doc(db, 'branches', branch.id);
    const cleanData = JSON.parse(JSON.stringify({ ...branch, updatedAt: new Date().toISOString() }));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving branch to Firestore:', error);
    return false;
  }
};

export const deleteBranchFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'branches', id));
    return true;
  } catch (error) {
    console.warn('Error deleting branch from Firestore:', error);
    return false;
  }
};

// DAY DATASETS FIRESTORE SERVICES ('day_datasets')
export const subscribeToDayDatasets = (callback: (datasets: DayDatasetRecord[]) => void) => {
  const q = query(collection(db, 'day_datasets'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as DayDatasetRecord[];
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Day datasets real-time listener error:', error);
  });
};

export const saveDayDatasetToFirestore = async (record: DayDatasetRecord): Promise<boolean> => {
  try {
    const docRef = doc(db, 'day_datasets', record.id);
    const cleanData = JSON.parse(JSON.stringify({ ...record, updatedAt: new Date().toISOString() }));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving day dataset record to Firestore:', error);
    return false;
  }
};

export const deleteDayDatasetFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'day_datasets', id));
    return true;
  } catch (error) {
    console.warn('Error deleting day dataset record from Firestore:', error);
    return false;
  }
};

// AUDIT LOGS FIRESTORE SERVICES ('audit_logs')
export const subscribeToAuditLogs = (callback: (logs: AuditLog[]) => void) => {
  const q = query(collection(db, 'audit_logs'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as AuditLog[];
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Audit logs real-time listener error:', error);
  });
};

export const addAuditLogToFirestore = async (log: AuditLog): Promise<boolean> => {
  try {
    const docRef = doc(db, 'audit_logs', log.id);
    const cleanData = JSON.parse(JSON.stringify(log));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving audit log to Firestore:', error);
    return false;
  }
};

// 9. SEED INITIAL DATA TO FIRESTORE IF EMPTY
export const seedInitialDataToFirestore = async (
  initialPosts: Post[], 
  initialCategories: Category[],
  initialPDFs: PDFBook[],
  initialVideos: VideoItem[],
  initialAudios: AudioItem[],
  initialInfoPages?: InfoPage[],
  initialDonationInitiativesList?: DonationInitiative[],
  initialAlbumsList?: GalleryAlbum[],
  initialSpiritualPersonalitiesList?: SpiritualPersonality[],
  initialBranchesList?: Branch[],
  initialDayDatasetsList?: DayDatasetRecord[]
) => {
  try {
    // 0. Clean up stale empty placeholder docs across collections
    try {
      const spSnapCheck = await getDocs(collection(db, 'spiritual_personalities'));
      for (const d of spSnapCheck.docs) {
        const data = d.data();
        if (!data || Object.keys(data).length === 0 || (!data.name && !data.title)) {
          await deleteDoc(doc(db, 'spiritual_personalities', d.id)).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Note cleaning placeholder doc:', e);
    }

    const postsSnap = await getDocs(collection(db, 'posts'));
    if (postsSnap.empty) {
      for (const p of initialPosts) {
        await setDoc(doc(db, 'posts', p.id), p);
      }
    }

    const catsSnap = await getDocs(collection(db, 'categories'));
    if (catsSnap.empty) {
      for (const c of initialCategories) {
        await setDoc(doc(db, 'categories', c.id), c);
      }
    }

    const pdfsSnap = await getDocs(collection(db, 'pdfs'));
    if (pdfsSnap.empty) {
      for (const pdf of initialPDFs) {
        await setDoc(doc(db, 'pdfs', pdf.id), pdf);
      }
    }

    const vidsSnap = await getDocs(collection(db, 'videos'));
    if (vidsSnap.empty) {
      for (const v of initialVideos) {
        await setDoc(doc(db, 'videos', v.id), v);
      }
    }

    const audiosSnap = await getDocs(collection(db, 'audios'));
    if (audiosSnap.empty) {
      for (const a of initialAudios) {
        await setDoc(doc(db, 'audios', a.id), a);
      }
    }

    if (initialInfoPages && initialInfoPages.length > 0) {
      const infoSnap = await getDocs(collection(db, 'info_pages'));
      if (infoSnap.empty) {
        for (const ip of initialInfoPages) {
          await setDoc(doc(db, 'info_pages', ip.id), ip);
        }
      }
    }

    if (initialDonationInitiativesList && initialDonationInitiativesList.length > 0) {
      const donInitSnap = await getDocs(collection(db, 'donation_initiatives'));
      if (donInitSnap.empty) {
        for (const di of initialDonationInitiativesList) {
          await setDoc(doc(db, 'donation_initiatives', di.id), di);
        }
      }
    }

    if (initialAlbumsList && initialAlbumsList.length > 0) {
      const albumsSnap = await getDocs(collection(db, 'albums'));
      if (albumsSnap.empty) {
        for (const alb of initialAlbumsList) {
          await setDoc(doc(db, 'albums', alb.id), alb);
        }
      }
    }

    if (initialSpiritualPersonalitiesList && initialSpiritualPersonalitiesList.length > 0) {
      const spSnap = await getDocs(collection(db, 'spiritual_personalities'));
      const validDocs = spSnap.docs.filter((d) => d.id !== 'zVYgaND97eRM4Lbd2eSh');
      if (validDocs.length === 0) {
        for (const sp of initialSpiritualPersonalitiesList) {
          await saveSpiritualPersonalityToFirestore(sp);
        }
      }
    }

    if (initialBranchesList && initialBranchesList.length > 0) {
      const brSnap = await getDocs(collection(db, 'branches'));
      if (brSnap.empty) {
        for (const br of initialBranchesList) {
          await saveBranchToFirestore(br);
        }
      }
    }

    if (initialDayDatasetsList && initialDayDatasetsList.length > 0) {
      const dsSnap = await getDocs(collection(db, 'day_datasets'));
      if (dsSnap.empty) {
        for (const ds of initialDayDatasetsList) {
          await saveDayDatasetToFirestore(ds);
        }
      }
    }
  } catch (err) {
    console.warn('Firestore seeding error:', err);
  }
};

// 8. FIREBASE CLOUD MESSAGING (FCM) HELPERS
export interface FCMPayload {
  title: string;
  titleUrdu?: string;
  body: string;
  bodyUrdu?: string;
  type: 'post' | 'event' | 'general' | 'pdf' | 'article';
  targetId?: string;
  id?: string;
}

export const requestFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging || typeof window === 'undefined') return null;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv6xXyK1lG23m7e2x'
      }).catch(err => {
        console.warn('FCM token request note:', err);
        return null;
      });
      return token || null;
    }
    return null;
  } catch (err) {
    console.warn('FCM requestPermission error:', err);
    return null;
  }
};

export const onFCMMessage = (callback: (payload: any) => void) => {
  let unsubFCM: (() => void) | null = null;
  if (messaging) {
    try {
      unsubFCM = onMessage(messaging, (payload) => {
        callback(payload);
      });
    } catch (err) {
      console.warn('FCM onMessage listener setup note:', err);
    }
  }

  const handleCustomFCM = (event: Event) => {
    const customEvt = event as CustomEvent;
    if (customEvt.detail) {
      callback(customEvt.detail);
    }
  };

  let bc: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      bc = new BroadcastChannel('fcm-notifications-channel');
      bc.onmessage = (msgEvent) => {
        if (msgEvent.data) {
          callback(msgEvent.data);
        }
      };
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('fcm-message', handleCustomFCM);
  }

  return () => {
    if (unsubFCM) {
      try { unsubFCM(); } catch {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('fcm-message', handleCustomFCM);
    }
    if (bc) {
      try { bc.close(); } catch {}
    }
  };
};

export const dispatchFCMNotification = async (payload: FCMPayload): Promise<void> => {
  const notifId = payload.id || `fcm-${Date.now()}`;
  const title = payload.title || 'Halqa-e-Usmania Update';
  const titleUrdu = payload.titleUrdu || title;
  const body = payload.body || '';
  const bodyUrdu = payload.bodyUrdu || body;

  const fcmPayload = {
    notification: {
      title,
      titleUrdu,
      body,
      bodyUrdu
    },
    data: {
      type: payload.type,
      targetId: payload.targetId || '',
      id: notifId,
      timestamp: new Date().toISOString()
    }
  };

  // 1. Save persistent notification record in Firestore
  const appNotif: AppNotification = {
    id: notifId,
    title,
    titleUrdu,
    body,
    bodyUrdu,
    date: new Date().toLocaleDateString('ur-PK'),
    type: payload.type === 'post' ? 'article' : (payload.type === 'event' ? 'event' : (payload.type === 'pdf' ? 'pdf' : 'announcement')),
    targetId: payload.targetId,
    status: 'published'
  };
  await sendNotificationToFirestore(appNotif);

  // 2. Dispatch FCM event locally & across tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fcm-message', { detail: fcmPayload }));
    if ('BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('fcm-notifications-channel');
        bc.postMessage(fcmPayload);
        setTimeout(() => bc.close(), 1000);
      } catch {}
    }
  }

  // 3. Trigger native browser notification if permitted and hidden
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    if (document.hidden) {
      try {
        new Notification(titleUrdu || title, {
          body: bodyUrdu || body,
          icon: '/splash.jpg',
          data: fcmPayload.data
        });
      } catch {}
    }
  }
};

// App Users & Registrations Firestore Services (syncs both 'users' and 'app_users')
export const subscribeToUsers = (callback: (users: AppUser[]) => void) => {
  const q = query(collection(db, 'users'));
  return onSnapshot(
    q,
    (snapshot) => {
      const users: AppUser[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as AppUser[];
      callback(dedupeById(users));
    },
    (error) => {
      console.warn('Error listening to users collection in Firestore:', error);
      // Fallback to app_users if needed
      subscribeToAppUsers(callback);
    }
  );
};

export const subscribeToAppUsers = (callback: (users: AppUser[]) => void) => {
  const q = query(collection(db, 'app_users'));
  return onSnapshot(
    q,
    (snapshot) => {
      const users: AppUser[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as AppUser[];
      callback(dedupeById(users));
    },
    (error) => {
      console.warn('Error listening to app_users collection in Firestore:', error);
    }
  );
};

export const addAppUserToFirestore = async (user: AppUser): Promise<void> => {
  try {
    const cleanUser = JSON.parse(JSON.stringify({ ...user, updatedAt: new Date().toISOString() }));
    await setDoc(doc(db, 'users', user.id), cleanUser, { merge: true });
    await setDoc(doc(db, 'app_users', user.id), cleanUser, { merge: true });
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    throw error;
  }
};

export const updateAppUserInFirestore = async (userId: string, data: Partial<AppUser>): Promise<void> => {
  try {
    const cleanData = JSON.parse(JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    await setDoc(doc(db, 'users', userId), cleanData, { merge: true });
    await setDoc(doc(db, 'app_users', userId), cleanData, { merge: true });
  } catch (error) {
    console.error('Error updating user in Firestore:', error);
    throw error;
  }
};

export const deleteAppUserFromFirestore = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    await deleteDoc(doc(db, 'app_users', userId));
  } catch (error) {
    console.error('Error deleting user from Firestore:', error);
    throw error;
  }
};

// 2. MASTER SLIPS LEDGER FIRESTORE SERVICES ('slips')
export const subscribeToSlips = (callback: (slips: any[]) => void) => {
  const q = query(collection(db, 'slips'));
  return onSnapshot(q, (snapshot) => {
    const slips = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(dedupeById(slips));
  }, (error) => {
    console.warn('Slips real-time listener error:', error);
  });
};

export const saveSlipToFirestore = async (slip: any): Promise<boolean> => {
  try {
    const docRef = doc(db, 'slips', slip.id);
    const cleanSlip = JSON.parse(JSON.stringify({ ...slip, updatedAt: new Date().toISOString() }));
    await setDoc(docRef, cleanSlip, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving slip to Firestore:', error);
    return false;
  }
};

export const cancelSlipInFirestore = async (slipId: string, reason: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'slips', slipId);
    await setDoc(docRef, {
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error cancelling slip in Firestore:', error);
    return false;
  }
};

export const deleteSlipFromFirestore = async (slipId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'slips', slipId));
    return true;
  } catch (error) {
    console.warn('Error deleting slip from Firestore:', error);
    return false;
  }
};

// 3. MAKHZAN-E-KHAS FIRESTORE SERVICES ('makhzan_e_khas' & 'makhzan_posts')
export const subscribeToMakhzanEKhas = (callback: (items: any[]) => void) => {
  const q = query(collection(db, 'makhzan_e_khas'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Makhzan-e-Khas real-time listener error:', error);
  });
};

export const saveMakhzanEKhasToFirestore = async (item: any): Promise<boolean> => {
  try {
    const cleanItem = JSON.parse(JSON.stringify({ ...item, updatedAt: new Date().toISOString() }));
    await setDoc(doc(db, 'makhzan_e_khas', item.id), cleanItem, { merge: true });
    await setDoc(doc(db, 'makhzan_posts', item.id), cleanItem, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Makhzan-e-Khas item to Firestore:', error);
    return false;
  }
};

export const deleteMakhzanEKhasFromFirestore = async (itemId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'makhzan_e_khas', itemId));
    await deleteDoc(doc(db, 'makhzan_posts', itemId));
    return true;
  } catch (error) {
    console.warn('Error deleting Makhzan-e-Khas item from Firestore:', error);
    return false;
  }
};

// 7. ABJAD ENGINE SETTINGS ('settings/abjad_engine')
export const subscribeToAbjadEngineSettings = (callback: (settings: any) => void) => {
  const docRef = doc(db, 'settings', 'abjad_engine');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.warn('Abjad Engine Settings listener error:', error);
  });
};

export const saveAbjadEngineSettings = async (settings: any): Promise<boolean> => {
  try {
    const docRef = doc(db, 'settings', 'abjad_engine');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Abjad Engine Settings to Firestore:', error);
    return false;
  }
};

// 8. VOICE READER SETTINGS ('settings/voice_reader')
export const subscribeToVoiceReaderSettings = (callback: (settings: any) => void) => {
  const docRef = doc(db, 'settings', 'voice_reader');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.warn('Voice Reader Settings listener error:', error);
  });
};

export const saveVoiceReaderSettings = async (settings: any): Promise<boolean> => {
  try {
    const docRef = doc(db, 'settings', 'voice_reader');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Voice Reader Settings to Firestore:', error);
    return false;
  }
};

// 9. APP CONFIGURATIONS ('settings/app_config')
export const subscribeToAppConfig = (callback: (config: any) => void) => {
  const docRef = doc(db, 'settings', 'app_config');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.warn('App Config listener error:', error);
  });
};

export const saveAppConfig = async (config: any): Promise<boolean> => {
  try {
    const docRef = doc(db, 'settings', 'app_config');
    await setDoc(docRef, { ...config, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving App Config to Firestore:', error);
    return false;
  }
};

// 10. SUMMARY STATISTICS ('stats/summary')
export const subscribeToStatsSummary = (callback: (stats: any) => void) => {
  const docRef = doc(db, 'stats', 'summary');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.warn('Stats summary listener error:', error);
  });
};

export const recalculateAndSaveStatsSummary = async (stats: {
  totalUsers?: number;
  totalPosts?: number;
  totalDonations?: number;
  totalDonationAmount?: number;
  totalEvents?: number;
  totalSlips?: number;
  totalMakhzanItems?: number;
}): Promise<boolean> => {
  try {
    const docRef = doc(db, 'stats', 'summary');
    await setDoc(docRef, {
      ...stats,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Stats Summary to Firestore:', error);
    return false;
  }
};

// Spiritual Personalities Real-Time Listener & CRUD
export const subscribeToSpiritualPersonalities = (callback: (personalities: SpiritualPersonality[]) => void) => {
  const q = query(collection(db, 'spiritual_personalities'));
  return onSnapshot(q, (snapshot) => {
    const validItems: SpiritualPersonality[] = [];
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data || Object.keys(data).length === 0 || (!data.name && !data.title)) {
        // Auto-clean stray empty document from Firestore
        deleteDoc(doc(db, 'spiritual_personalities', docSnap.id)).catch(() => {});
      } else {
        validItems.push({
          id: docSnap.id,
          ...data
        } as SpiritualPersonality);
      }
    });
    callback(dedupeById(validItems));
  }, (error) => {
    console.warn('Spiritual Personalities real-time listener error:', error);
  });
};

export const saveSpiritualPersonalityToFirestore = async (personality: SpiritualPersonality): Promise<boolean> => {
  try {
    if (!auth.currentUser) {
      try {
        await firebaseSignInAnonymously();
      } catch (authErr) {
        console.warn('[Firestore Auth Warning] Unable to sign in anonymously before save:', authErr);
      }
    }
    const docRef = doc(db, 'spiritual_personalities', personality.id);
    const cleanData = JSON.parse(JSON.stringify(personality));
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(docRef, cleanData, { merge: true });

    try {
      const docRefAlt = doc(db, 'spiritualPersonalities', personality.id);
      await setDoc(docRefAlt, cleanData, { merge: true });
    } catch {}

    console.log(`[Firestore Success] Saved spiritual personality ${personality.id} to Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Write Error] Failed to save spiritual personality to Firestore:', error);
    return false;
  }
};

export const deleteSpiritualPersonalityFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'spiritual_personalities', id));
    try {
      await deleteDoc(doc(db, 'spiritualPersonalities', id));
    } catch {}
    console.log(`[Firestore] Successfully deleted spiritual personality ${id}`);
    return true;
  } catch (error) {
    console.error('[Firestore Error] Failed to delete spiritual personality from Firestore:', error);
    return false;
  }
};

// Makhzan Posts & Categories Firestore Sync
export const subscribeToMakhzanPosts = (callback: (posts: MakhzanPost[]) => void) => {
  const q = query(collection(db, 'makhzan_posts'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as MakhzanPost[];
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Makhzan posts real-time listener error:', error);
  });
};

export const saveMakhzanPostToFirestore = async (post: MakhzanPost): Promise<boolean> => {
  try {
    const docRef = doc(db, 'makhzan_posts', post.id);
    const cleanPost = JSON.parse(JSON.stringify(post));
    await setDoc(docRef, cleanPost, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Makhzan post to Firestore:', error);
    return false;
  }
};

export const deleteMakhzanPostFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'makhzan_posts', id));
    console.log(`[Firestore] Successfully deleted Makhzan post ${id}`);
    return true;
  } catch (error) {
    console.error('[Firestore Error] Failed to delete Makhzan post from Firestore:', error);
    return false;
  }
};

export const subscribeToMakhzanCategories = (callback: (categories: MakhzanCategory[]) => void) => {
  const q = query(collection(db, 'makhzan_categories'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as MakhzanCategory[];
    callback(dedupeById(items));
  }, (error) => {
    console.warn('Makhzan categories real-time listener error:', error);
  });
};

export const saveMakhzanCategoryToFirestore = async (cat: MakhzanCategory): Promise<boolean> => {
  try {
    const docRef = doc(db, 'makhzan_categories', cat.id);
    const cleanCat = JSON.parse(JSON.stringify(cat));
    await setDoc(docRef, cleanCat, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving Makhzan category to Firestore:', error);
    return false;
  }
};

export const deleteMakhzanCategoryFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'makhzan_categories', id));
    return true;
  } catch (error) {
    console.warn('Error deleting Makhzan category from Firestore:', error);
    return false;
  }
};



// POST SPLASH SCREENS ('post_splash_screens')
export const subscribeToPostSplashScreens = (callback: (screens: PostSplashScreenItem[]) => void) => {
  const q = query(collection(db, 'post_splash_screens'));
  return onSnapshot(q, (snapshot) => {
    const screens = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PostSplashScreenItem[];
    callback(dedupeById(screens));
  }, (error) => {
    console.warn('Post-splash screens real-time listener error:', error);
  });
};

export const savePostSplashScreenToFirestore = async (screen: PostSplashScreenItem): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'post_splash_screens', screen.id), JSON.parse(JSON.stringify(screen)), { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving post-splash screen to Firestore:', error);
    return false;
  }
};

export const deletePostSplashScreenFromFirestore = async (screenId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'post_splash_screens', screenId));
    return true;
  } catch (error) {
    console.warn('Error deleting post-splash screen from Firestore:', error);
    return false;
  }
};
