 import StoreDashboardShell from '@/components/layout/dashboard/StoreDashboardShell';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <StoreDashboardShell>{children}</StoreDashboardShell>;
}
