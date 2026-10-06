import { ReactNode } from 'react';
import UserDashboardShell from '@/components/layout/dashboard/UserDashboardShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
