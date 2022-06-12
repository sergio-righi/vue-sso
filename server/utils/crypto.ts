import { default as ConfigUtil } from './env';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const secret = ConfigUtil.get('authentication.token.secret');
const algorithm = 'aes-192-cbc';

const key = scryptSync(secret, 'salt', 24);
const iv = Buffer.alloc(16, 0);

export default {

  encrypt: (value: string) => {
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  decrypt: (value: string) => {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}