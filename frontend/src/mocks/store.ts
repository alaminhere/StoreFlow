import { Store, StoreMember } from '@/types/store.types';

export const store: Store = {
  id: 'store-001',
  name: 'Alamin Electronics',
  email: 'store@example.com',
  phone: '017XXXXXXXX',
  logo: {
    url: '/react.png',
    public_id: 'one t wo',
  },

  tagline: 'Alamin Electronics',
  address: 'Dhaka',
  invoiceFooterNote: '',
  currentMember: {
    id: 'member-001',
    userId: 'user-001',
    name: 'Alamin',
    email: 'alamin@example.com',
    phone: '017XXXXXXXX',
    role: 'OWNER',
  },
};

export const storeMembers: StoreMember[] = [
  {
    id: 'member-001',
    userId: 'user-001',
    name: 'Alamin',
    email: 'alamin@example.com',
    phone: '017XXXXXXXX',
    role: 'OWNER',
    address: 'Dhaka, Bangladesh',
    createdAt: '2026-08-01',
  },
  {
    id: 'member-002',
    userId: 'user-002',
    name: 'Rahim',
    email: 'rahim@example.com',
    phone: '018XXXXXXXX',
    role: 'ADMIN',
    address: 'Chattogram, Bangladesh',
    createdAt: '2026-08-15',
  },
  {
    id: 'member-003',
    userId: 'user-003',
    name: 'Karim',
    email: 'karim@example.com',
    phone: '019XXXXXXXX',
    role: 'SALESMAN',
    address: 'Sachet, Bangladesh',
    createdAt: '2026-09-05',
  },
  {
    id: 'member-004',
    userId: 'user-003',
    name: 'Karim',
    email: 'karim@example.com',
    phone: '019XXXXXXXX',
    role: 'SALESMAN',
    address: 'Sachet, Bangladesh',
    createdAt: '2026-09-05',
  },
  {
    id: 'member-005',
    userId: 'user-003',
    name: 'Karim',
    email: 'karim@example.com',
    phone: '019XXXXXXXX',
    role: 'SALESMAN',
    address: 'Sachet, Bangladesh',
    createdAt: '2026-09-05',
  },
];
