// Input validation utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStringLength = (input: string, min: number, max: number): boolean => {
  return input.length >= min && input.length <= max;
};

export const validateFileName = (fileName: string): boolean => {
  // Prevent path traversal and injection
  const invalidPatterns = [
    /\.\./,  // Path traversal
    /[<>:"/\\|?*\x00-\x1F]/,  // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i  // Reserved names
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(fileName));
};

export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const getCSRFToken = (): string => {
  let token = sessionStorage.getItem('csrf-token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf-token', token);
  }
  return token;
};

export const validateCSRFToken = (providedToken: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf-token');
  return providedToken === storedToken;
};

// Rate limiting for login attempts
export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): boolean => {
  const key = `rate_limit_${identifier}`;
  const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "timestamp": null}');
  
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  // Reset if window expired
  if (attempts.timestamp && (now - attempts.timestamp) > windowMs) {
    attempts.count = 0;
  }
  
  if (attempts.count >= maxAttempts) {
    return false; // Rate limited
  }
  
  // Increment attempt count
  attempts.count++;
  attempts.timestamp = now;
  localStorage.setItem(key, JSON.stringify(attempts));
  
  return true;
};

// Secure password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La password deve essere di almeno 8 caratteri');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera maiuscola');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera minuscola');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La password deve contenere almeno un numero');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La password deve contenere almeno un carattere speciale');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};