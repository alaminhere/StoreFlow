'use client';

import { ReactNode, useState } from 'react';

import UserMenu from './UserMenu';
import { Menu, X } from '@/helpers/icon/icon';
import DashboardHeader from './DashboardHeader';
import Logo from '@/components/shared/SiteLogo';
import DashboardSidebar from './DashboardSidebar';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ThemeToggle from '@/components/shared/ThemeToggle';
import UserPopupMenu from '@/components/shared/user/UserPopupMenu';

const UserDashboardShell = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(prev => !prev)}
      >
        <div className="flex h-full w-2/3 flex-col border-r border-border bg-surface md:w-full">
          <div className="space-y-0 border-b border-b-border p-3 pt-3.5 pb-4">
            <Logo />
          </div>
          <UserMenu />
        </div>
      </DashboardSidebar>
      {/* main content */}
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-none">
        <DashboardHeader>
          <div className="flex items-center w-full">
            <Breadcrumb title="profile" className=" hidden md:flex" />
            <UserPopupMenu className="md:hidden" showText={false} size='lg' />
          </div>
          <div className="flex justify-center items-center gap-1 md:gap-4">
            <ThemeToggle />
            <UserPopupMenu className="hidden md:flex!" />
            <button
              className="md:hidden p-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-surface"
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={24} />}
            </button>
          </div>
        </DashboardHeader>
        {/* content */}
        <main className="max-w-7xl w-full mx-auto"> {children}</main>
      </div>
    </div>
  );
};

export default UserDashboardShell;
