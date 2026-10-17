import { User } from '@/types/user/user.types';

export const user: User = {
  id: 'user-001',
  name: 'Alamin',
  email: 'alamin@example.com',
  phone: '017XXXXXXXX',
  address: '',
  currentStore: {
    id: 'store-002',
    name: 'Alamin Electronics',
    email: 'store@example.com',

    role: 'OWNER',
  },
  stores: [
    {
      id: 'store-002',
      name: 'Alamin Electronics',
      email: 'store@example.com',

      role: 'OWNER',
    },
    {
      id: 'store-003',
      name: 'Tech Point',
      email: 'tech@example.com',
      role: 'ADMIN',
    },
    {
      id: 'store-004',
      name: 'Corset',
      email: 'tech@example.com',
      role: 'MANAGER',
    },
    {
      id: 'store-005',
      name: 'Hafu',
      email: 'tech@example.com',
      role: 'SALESMAN',
    },
  ],
};

export interface UserStore {
  id: string;
  name: string;
  email: string;
  phone: string;
}
export const users: UserStore[] = [
  {
    id: 'user-001',
    name: 'Alamin Hose',
    email: 'alamin@example.com',
    phone: '01712345678',
  },
  {
    id: 'user-002',
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    phone: '01812345678',
  },
  {
    id: 'user-003',
    name: 'Karim Hasan',
    email: 'karim@example.com',
    phone: '01912345678',
  },
  {
    id: 'user-004',
    name: 'Sabbir Hossain',
    email: 'sabbir@example.com',
    phone: '01612345678',
  },
  {
    id: 'user-005',
    name: 'Nayeem Islam',
    email: 'nayeem@example.com',
    phone: '01512345678',
  },
  {
    id: 'user-006',
    name: 'Alamin Hosern',
    email: 'alamin1developer@gmail.com',
    phone: '01312345678',
  },
];
