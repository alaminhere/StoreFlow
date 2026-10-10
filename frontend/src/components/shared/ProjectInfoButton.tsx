'use client';

import { ReactNode, useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import ProjectShowcaseModal from './ProjectShowcaseModal';

const STORAGE_KEY = 'StoreFlow-showcase-seen';

interface ProjectInfoButtonProps {
  autoOpen?: boolean;
  className?: string;
  children?: ReactNode;
}

const ProjectInfoButton = ({
  autoOpen = false,
  className,
  children = 'Project Info',
}: ProjectInfoButtonProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true);
  }, [autoOpen]);

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)} className={className}>
        {children}
      </Button>
      {open && <ProjectShowcaseModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default ProjectInfoButton;
