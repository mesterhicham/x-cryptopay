import * as crypto from 'crypto';

/**
 * AES-256-GCM Encryption Utility
 * 
 * Uses AES-256-GCM which provides both encryption AND authentication (tamper detection).
 * The ENCRYPTION_KEY must be exactly 32 bytes (64 hex chars) set in .env.
 * 
 * Format: iv:authTag:encryptedData (all hex-encoded)
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error('🚨 ENCRYPTION_KEY must be a 64-char hex string (32 bytes) in .env');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 * @returns encrypted string in format: iv:authTag:ciphertext
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted string
 * @param encryptedText in format: iv:authTag:ciphertext
 * @returns decrypted plaintext
 */
export function decrypt(encryptedText: string): string {
  const key = getEncryptionKey();
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Check if a string is already encrypted (has the iv:tag:data format)
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32;
}
