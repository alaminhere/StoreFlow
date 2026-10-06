import bcrypt from 'bcrypt';
import { PASSWORD } from '../constants/index.js';

export const hashPassword = (plain: string): Promise<string> => {
  return bcrypt.hash(plain, PASSWORD.SALT_ROUNDS);
};

export const comparePassword = (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
