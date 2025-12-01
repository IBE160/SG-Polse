import { createHash, randomBytes } from 'crypto';

const TOKEN_EXPIRATION_HOURS = 24;

export const generateVerificationToken = () => {
  const token = randomBytes(32).toString('hex'); // Generate a 32-byte (64-character hex) random token
  const hashedToken = createHash('sha256').update(token).digest('hex'); // Hash the token for storage

  const expires = new Date();
  expires.setHours(expires.getHours() + TOKEN_EXPIRATION_HOURS); // Token valid for 24 hours

  return { token, hashedToken, expires };
};

export const verifyVerificationToken = (plainToken: string, hashedToken: string) => {
  const incomingHashedToken = createHash('sha256').update(plainToken).digest('hex');
  return incomingHashedToken === hashedToken;
};
