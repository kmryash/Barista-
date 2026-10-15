// Content safety, profanity filtering, URL validation, and sanitization

const PROFANITY_WORDS = [
  'badword', 'bastard', 'bitch', 'damn', 'fuck', 'shit', 'asshole', 'crap', 'cunt', 'dick', 'piss', 'fag', 'slut', 'whore'
];

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return PROFANITY_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  // Strip HTML tags and control characters
  return text.replace(/[<>'"/\\&;]/g, '').trim();
}

export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeText(name);
  if (!sanitized || sanitized.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  if (sanitized.length > 30) {
    return { valid: false, error: 'Name must be 30 characters or fewer.' };
  }
  if (containsProfanity(sanitized)) {
    return { valid: false, error: 'Name contains disallowed language.' };
  }
  return { valid: true };
}

export function validateLinkTitle(title: string): { valid: boolean; error?: string } {
  if (!title) return { valid: false, error: 'Link title is required.' };
  const sanitized = sanitizeText(title);
  if (sanitized.length > 20) {
    return { valid: false, error: 'Link title must be 20 characters or fewer (max 20).' };
  }
  if (containsProfanity(sanitized)) {
    return { valid: false, error: 'Title contains disallowed words.' };
  }

  // Reject titles that look like URLs or domains ('http', 'www', '.com', '.in', '.io', etc.)
  const domainPatterns = /(https?:\/\/|www\.|\.com\b|\.in\b|\.io\b|\.org\b|\.net\b|\.co\b|\.xyz\b|\.app\b|\.me\b)/i;
  if (domainPatterns.test(sanitized)) {
    return { valid: false, error: 'Link title cannot be a URL or domain. Use plain text (e.g. "My Instagram").' };
  }

  return { valid: true };
}

export function validateLinkUrl(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: false, error: 'URL is required.' };
  if (url.length > 200) {
    return { valid: false, error: 'URL must be 200 characters or fewer.' };
  }
  // Must be https only
  if (!url.startsWith('https://')) {
    return { valid: false, error: 'Only secure https:// links are permitted.' };
  }
  // Block javascript:, data:, and IP-only URLs
  const dangerousProtocols = /(javascript:|data:|vbscript:|file:)/i;
  if (dangerousProtocols.test(url)) {
    return { valid: false, error: 'Unsafe URL protocol detected.' };
  }
  // Block IP-only URLs (e.g. https://192.168.1.1 or https://1.1.1.1)
  const ipOnlyPattern = /^https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;
  if (ipOnlyPattern.test(url)) {
    return { valid: false, error: 'Direct IP address links are prohibited for user safety.' };
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, error: 'Invalid domain name in URL.' };
    }
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }

  return { valid: true };
}

export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMime.includes(file.type)) {
    return { valid: false, error: 'Photo must be JPG, PNG, or WebP format.' };
  }
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Photo size cannot exceed 2 MB.' };
  }
  return { valid: true };
}
