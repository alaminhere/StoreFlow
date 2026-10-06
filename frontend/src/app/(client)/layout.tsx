import { ReactNode } from 'react';
import PublicFooter from '@/components/layout/client/PublicFooter';
import PublicHeader from '@/components/layout/client/PublicHeader';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
