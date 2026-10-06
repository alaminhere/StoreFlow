'use client';
import { ReactNode } from 'react';

const DashboardHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <header className="border-b border-border sticky top-0 left-0 right-0 px-5 py-4 flex justify-between items-center bg-surface/10 backdrop-blur-sm z-10">
      {children}
    </header>
  );
};

export default DashboardHeader;
