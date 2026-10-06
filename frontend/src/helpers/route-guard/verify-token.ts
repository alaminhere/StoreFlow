import { jwtVerify } from 'jose';
import { StoreTokenPayload } from '@/types/store.types';

export const verifyStoreToken = async (
  token: string,
): Promise<StoreTokenPayload | null> => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as StoreTokenPayload;
  } catch {
    return null;
  }
};
