import { StoreMemberRole } from '../store.types';

export interface UserStore {
  id: string;
  name: string;
  email: string;
  role: StoreMemberRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  currentUser?: UserStore | null;
  stores?: UserStore[];
}
export interface UpdateUser {
  name: string;
  email: string;
  phone: string;
  address?: string;
}
