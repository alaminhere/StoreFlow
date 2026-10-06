'use client';

import { ChevronRight } from '@/helpers/icon/icon';
import { usePathname } from 'next/navigation';

const Breadcrumb = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const segments = usePathname().split('/');
  const path = segments[segments.length - 1];

  return (
    <div className={` flex items-center gap-1 ${className}`}>
      <p className="text-sm font-medium text-text capitalize">{title}</p>
      {path !== title.toLowerCase() && (
        <div className=" text-text flex items-center gap-1">
          <ChevronRight size={14} className="text-text-muted!" />
          <p className="text-sm font-medium text-text capitalize">{path}</p>
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
