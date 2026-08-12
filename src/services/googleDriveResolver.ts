import { GoogleDriveResolveResult } from '../types';

/**
 * Universal Google Drive File Link Handler & Resolver Service
 * 
 * Supports standard file URLs, sharing links, uc direct links, open?id= links, folder links,
 * and standard non-Google HTTPS links.
 */

// Cache map to store validated results in-memory and localStorage
const cacheMap = new Map<string, GoogleDriveResolveResult>();

// Load localStorage cache on initialize
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('halqa_gdrive_resolver_cache');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([k, v]) => {
        cacheMap.set(k, v as GoogleDriveResolveResult);
      });
    }
  } catch (e) {
    console.warn('Failed to load Google Drive resolver cache', e);
  }
}

function saveCacheToStorage() {
  if (typeof window === 'undefined') return;
  try {
    const obj: Record<string, GoogleDriveResolveResult> = {};
    // Store up to 100 recent entries
    const entries = Array.from(cacheMap.entries()).slice(-100);
    entries.forEach(([k, v]) => { obj[k] = v; });
    localStorage.setItem('halqa_gdrive_resolver_cache', JSON.stringify(obj));
  } catch (e) {
    // Ignore storage errors
  }
}

export class GoogleDriveResolver {
  /**
   * Check if a URL belongs to Google Drive or Google Docs
   */
  public static isGoogleDriveUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.trim().toLowerCase();
    return cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com');
  }

  /**
   * Check if a URL is a Google Drive FOLDER link
   */
  public static isFolderUrl(url: string): boolean {
    if (!url) return false;
    const cleanUrl = url.trim();
    // Patterns for folders: /drive/folders/ID or /drive/u/0/folders/ID
    return /\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i.test(cleanUrl) ||
           (cleanUrl.includes('drive.google.com/open') && cleanUrl.includes('folder'));
  }

  /**
   * Extract Folder ID if URL is a Google Drive folder
   */
  public static extractFolderId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) return match[1];
    return null;
  }

  /**
   * Safely extract Google Drive File ID from any valid Google Drive URL format
   */
  public static extractFileId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    // Check if it's a folder first
    if (this.isFolderUrl(cleanUrl)) {
      return null;
    }

    // Pattern 1: /file/d/FILE_ID or /d/FILE_ID or /document/d/FILE_ID
    const matchFileD = cleanUrl.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/i);
    if (matchFileD && matchFileD[1]) {
      return matchFileD[1];
    }

    // Pattern 2: ?id=FILE_ID or &id=FILE_ID (from /open?id=, /uc?id=, /thumbnail?id=)
    try {
      const urlObj = new URL(cleanUrl);
      const idParam = urlObj.searchParams.get('id');
      if (idParam && idParam.length >= 20) {
        return idParam;
      }
    } catch (e) {
      // Fallback regex for param matching if URL constructor fails
      const paramMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]{20,})/i);
      if (paramMatch && paramMatch[1]) {
        return paramMatch[1];
      }
    }

    // Pattern 3: Direct /d/FILE_ID without prefix
    const matchDirectD = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]{20,})/i);
    if (matchDirectD && matchDirectD[1]) {
      return matchDirectD[1];
    }

    return null;
  }

  /**
   * Determine Provider type based on URL
   */
  public static detectProvider(url: string): 'google_drive' | 'direct_https' | 'firebase_storage' | 'supabase' | 'other' {
    if (!url) return 'other';
    const clean = url.toLowerCase();
    if (clean.includes('drive.google.com') || clean.includes('docs.google.com')) {
      return 'google_drive';
    }
    if (clean.includes('firebasestorage.googleapis.com')) {
      return 'firebase_storage';
    }
    if (clean.includes('supabase.co')) {
      return 'supabase';
    }
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return 'direct_https';
    }
    return 'other';
  }

  /**
   * Infer File Type ('pdf', 'image', 'audio', 'video', 'doc', 'folder', 'unknown') from URL or Mime
   */
  public static inferFileType(url: string, mimeType?: string): 'pdf' | 'image' | 'audio' | 'video' | 'doc' | 'folder' | 'unknown' {
    if (this.isFolderUrl(url)) return 'folder';

    if (mimeType) {
      const mime = mimeType.toLowerCase();
      if (mime.includes('pdf')) return 'pdf';
      if (mime.includes('image')) return 'image';
      if (mime.includes('audio')) return 'audio';
      if (mime.includes('video')) return 'video';
      if (mime.includes('word') || mime.includes('document') || mime.includes('text')) return 'doc';
    }

    const clean = url.toLowerCase();
    if (clean.includes('.pdf') || clean.includes('pdf')) return 'pdf';
    if (clean.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)) return 'image';
    if (clean.match(/\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i)) return 'audio';
    if (clean.match(/\.(mp4|webm|mkv|mov)(\?.*)?$/i)) return 'video';
    if (clean.match(/\.(doc|docx|txt|rtf)(\?.*)?$/i)) return 'doc';

    return 'pdf'; // Default expectation for document links in Islamic library
  }

  /**
   * Normalize and construct Google Drive URLs from a File ID
   */
  public static getUrlsFromFileId(fileId: string) {
    return {
      resolvedUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      viewUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      publicViewUrl: `https://drive.google.com/file/d/${fileId}/view`
    };
  }

  /**
   * Universal Resolve & Validate Function
   * 
   * Resolves any Google Drive or Direct URL, validates file access, checks HTTP status,
   * detects folder vs file, and checks for access restriction / HTML errors.
   */
  public static async resolveUrl(
    inputUrl: string, 
    bypassCache: boolean = false
  ): Promise<GoogleDriveResolveResult> {
    if (!inputUrl || typeof inputUrl !== 'string' || !inputUrl.trim()) {
      return {
        success: false,
        isGoogleDrive: false,
        originalUrl: inputUrl || '',
        provider: 'other',
        errorCode: 'INVALID_URL',
        message: 'Empty or invalid URL provided.',
        detailsUrdu: 'غیر معتبر یا خالی یو آر ایل۔'
      };
    }

    const cleanUrl = inputUrl.trim();

    // Check Cache first if not bypassing
    if (!bypassCache && cacheMap.has(cleanUrl)) {
      const cached = cacheMap.get(cleanUrl)!;
      // If cached as successful or error, return cached copy
      return cached;
    }

    // 1. Check if it's a FOLDER URL
    if (this.isFolderUrl(cleanUrl)) {
      const result: GoogleDriveResolveResult = {
        success: false,
        isGoogleDrive: true,
        isFolder: true,
        fileType: 'folder',
        originalUrl: cleanUrl,
        provider: 'google_drive',
        errorCode: 'FOLDER_NOT_FILE',
        message: 'This is a Google Drive folder link. Please select or provide the link of the actual file.',
        detailsUrdu: 'یہ گوگل ڈرائیو کا فولڈر لنک ہے۔ برائے مہربانی کسی مخصوص فائل کا لنک درج کریں۔'
      };
      cacheMap.set(cleanUrl, result);
      saveCacheToStorage();
      return result;
    }

    const provider = this.detectProvider(cleanUrl);

    // 2. NON-GOOGLE DRIVE DIRECT URLS (e.g. Firebase, Supabase, Direct HTTPS PDF)
    if (provider !== 'google_drive') {
      const inferredType = this.inferFileType(cleanUrl);
      
      // Perform light validation check if browser online
      let isValid = true;
      let errorMsg = '';

      if (typeof window !== 'undefined' && navigator.onLine) {
        try {
          // Send lightweight HEAD / GET fetch request
          const res = await fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors' }).catch(() => null);
          if (res && res.status >= 400) {
            isValid = false;
            errorMsg = `Server returned HTTP ${res.status}`;
          }
        } catch (e) {
          // Non-blocking fetch fail - keep valid
        }
      }

      const result: GoogleDriveResolveResult = {
        success: isValid,
        isGoogleDrive: false,
        originalUrl: cleanUrl,
        provider,
        fileType: inferredType,
        resolvedUrl: cleanUrl,
        previewUrl: cleanUrl,
        viewUrl: cleanUrl,
        errorCode: isValid ? undefined : 'NETWORK_ERROR',
        message: isValid ? 'Direct file URL detected' : (errorMsg || 'Unable to connect to direct URL'),
        detailsUrdu: isValid ? 'براہِ راست فائل یو آر ایل' : 'فائل کنکشن میں دشواری۔'
      };

      cacheMap.set(cleanUrl, result);
      saveCacheToStorage();
      return result;
    }

    // 3. GOOGLE DRIVE FILE URL PROCESSING
    const fileId = this.extractFileId(cleanUrl);

    if (!fileId) {
      const result: GoogleDriveResolveResult = {
        success: false,
        isGoogleDrive: true,
        originalUrl: cleanUrl,
        provider: 'google_drive',
        errorCode: 'INVALID_URL',
        message: 'Could not extract valid Google Drive File ID. Please check the URL format.',
        detailsUrdu: 'گوگل ڈرائیو فائل آئی ڈی حاصل نہیں ہو سکی۔ برائے مہربانی صحیح لنک پیسٹ کریں۔'
      };
      cacheMap.set(cleanUrl, result);
      saveCacheToStorage();
      return result;
    }

    const driveUrls = this.getUrlsFromFileId(fileId);

    // 4. Validate Google Drive File Access & Type
    let isAccessible = true;
    let errorCode: GoogleDriveResolveResult['errorCode'] = undefined;
    let message = '✓ Google Drive file recognized and accessible.';
    let detailsUrdu = 'گوگل ڈرائیو فائل کامیابی سے تسلیم کر لی گئی۔';
    let detectedMime = 'application/pdf';

    if (typeof window !== 'undefined' && navigator.onLine) {
      try {
        // Attempt to check image thumbnail or preview endpoint to verify public accessibility
        const thumbUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
        const testRes = await fetch(thumbUrl, { method: 'GET', mode: 'cors' }).catch(() => null);

        if (testRes) {
          if (testRes.status === 403 || testRes.status === 401) {
            isAccessible = false;
            errorCode = 'ACCESS_DENIED';
            message = 'Google Drive file access denied. Please change the file sharing setting to: Anyone with the link → Viewer';
            detailsUrdu = 'گوگل ڈرائیو فائل تک رسائی کی اجازت نہیں ہے۔ برائے مہربانی شیئرنگ کی ترتیبات میں "Anyone with the link → Viewer" رکھیں!';
          } else if (testRes.status === 404) {
            isAccessible = false;
            errorCode = 'FILE_NOT_FOUND';
            message = 'Google Drive file not found or has been deleted.';
            detailsUrdu = 'گوگل ڈرائیو پر فائل نہیں ملی یا ڈیلیٹ ہو چکی ہے۔';
          } else if (testRes.ok) {
            const contentType = testRes.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
              // HTML response returned when expecting image thumbnail or file stream indicates restricted permission page
              isAccessible = false;
              errorCode = 'ACCESS_DENIED';
              message = 'Google Drive file access denied. Please change the file sharing setting to: Anyone with the link → Viewer';
              detailsUrdu = 'گوگل ڈرائیو فائل تک رسائی کی اجازت نہیں ہے۔ برائے مہربانی شیئرنگ لنک پبلک کریں۔';
            } else if (contentType) {
              detectedMime = contentType;
            }
          }
        }
      } catch (e) {
        // Network/CORS limits should not flag error if URL is well formed
        console.warn('Google Drive resolution fetch check warning:', e);
      }
    } else if (typeof window !== 'undefined' && !navigator.onLine) {
      errorCode = 'NETWORK_ERROR';
      message = 'No internet connection. This Google Drive file cannot be validated while offline.';
      detailsUrdu = 'انٹرنیٹ کنکشن دستیاب نہیں ہے۔';
      isAccessible = false;
    }

    const inferredType = this.inferFileType(cleanUrl, detectedMime);

    const result: GoogleDriveResolveResult = {
      success: isAccessible,
      isGoogleDrive: true,
      fileId,
      originalUrl: cleanUrl,
      provider: 'google_drive',
      fileType: inferredType,
      mimeType: detectedMime,
      resolvedUrl: driveUrls.resolvedUrl,
      previewUrl: driveUrls.previewUrl,
      viewUrl: driveUrls.publicViewUrl,
      errorCode,
      message,
      detailsUrdu
    };

    cacheMap.set(cleanUrl, result);
    saveCacheToStorage();
    return result;
  }

  /**
   * Helper to clear or invalidate cache for a specific URL
   */
  public static invalidateCache(url: string) {
    if (!url) return;
    cacheMap.delete(url.trim());
    saveCacheToStorage();
  }
}
