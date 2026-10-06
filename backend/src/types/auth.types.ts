import type { JwtPayload } from 'jsonwebtoken';
import type { Role } from './permission.types.js';

export interface AuthPayload extends JwtPayload {
  userId: string;
}
export interface StorePayload extends JwtPayload {
  userId: string;
  storeId: string;
  role: Role;
}
