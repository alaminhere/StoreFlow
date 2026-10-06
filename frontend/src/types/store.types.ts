export interface StoreTokenPayload {
  userId?: string;
  storeId?: string;
  role?: string;
}

type Logo = {
  url: string;
  public_id: string;
};

export interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo: Logo;
  tagline: string;
  address: string;
  currentMember: StoreMember;
  invoiceFooterNote: string;
}

export interface CreateStore {
  name: string;
  email: string;
  phone: string;
  logo: Logo;
  tagline: string;
  address: string;
}
export interface UpdateStore {
  name?: string;
  email?: string;
  phone?: string;
  logo?: Logo;
  tagline?: string;
  address?: string;
  invoiceFooterNote?: string;
}

// MEMBER
export type StoreMemberRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'SALESMAN';

export interface StoreMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: StoreMemberRole;
  address?: string;
  createdAt?: string;
}

export interface CreateStoreMember {
  userId: string;
  role: StoreMemberRole;
}
export type UpdateStoreMember = {
  id: string;
  role: string;
};
