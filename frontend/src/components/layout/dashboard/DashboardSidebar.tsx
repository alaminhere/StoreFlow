import clsx from 'clsx';
import { ReactNode } from 'react';

const DashboardSidebar = ({
  isOpen,
  onToggle,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) => {
  return (
    <>
      <aside
        onClick={onToggle}
        className={clsx(
          'bg-surface/10 backdrop-blur-sm fixed md:static md:flex flex-col top-0 left-0 ',
          'w-full h-full max-w-full md:max-w-60 min-h-full transition-all duration-200 z-50',
          isOpen ? '' : 'transform -translate-x-full md:translate-x-0',
        )}
      >
        {children}
      </aside>
    </>
  );
};

export default DashboardSidebar;
