'use client';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { MoreVertical } from '@/helpers/icon/icon';

interface ActionMenuProps {
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
}

const ActionMenu = ({
  children,
  className,
  triggerClassName,
}: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className={triggerClassName ?? 'cursor-pointer px-1'}
        aria-label="Actions"
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className={
            className ??
            'absolute right-0 top-full w-44 bg-surface rounded-lg shadow-lg z-20 overflow-hidden'
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
