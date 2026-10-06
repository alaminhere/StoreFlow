'use client';

import StoreMenu from './StoreMenu';
import { ReactNode, useState } from 'react';
import { Menu, X } from '@/helpers/icon/icon';
import DashboardSidebar from './DashboardSidebar';
import StoreAvatar from '@/components/shared/store/StoreAvatar';
import DashboardHeader from './DashboardHeader';
import Breadcrumb from '@/components/shared/Breadcrumb';
import StorePopupMenu from '@/components/shared/store/StorePopupMenu';
import ThemeToggle from '@/components/shared/ThemeToggle';


const StoreDashboardShell = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Dashboard Sidebar */}
      <DashboardSidebar
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(prev => !prev)}
      >
        <div className="flex h-full w-2/3 flex-col border-r border-border bg-surface md:w-full">
          <div className="space-y-0 border-b border-b-border p-3 pt-3.5 pb-4">
            <StoreAvatar />
          </div>
          <StoreMenu />
        </div>
      </DashboardSidebar>
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-none">
        {/* Dashboard Header */}
        <DashboardHeader>
          <div className="flex items-center">
            <Breadcrumb title="Dashboard" className=" hidden md:flex" />
            <StorePopupMenu className="md:hidden" />
          </div>
          <div className="flex justify-center items-center gap-2 md:gap-4">
            {/* <SearchBar /> */}
            <ThemeToggle />
            <StorePopupMenu className="hidden md:flex!" />
            <button
              className="md:hidden p-1.5   rounded-md cursor-pointer"
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </DashboardHeader>
        <main> {children}</main>
      </div>
    </div>
  );
};

export default StoreDashboardShell;
