'use client';

import getInitials from '@/helpers/getInitials';
import clsx from 'clsx';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-8.5 h-8.5 text-xs md:text-sm',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-16 h-16 text-xl',
};

const Avatar = ({
  className,
  name,
  details,
  size = 'md',
}: {
  className?: string;
  name?: string;
  details?: string;
  size?: AvatarSize;
}) => {
  const { color, initials } = getInitials(name || 'N/A');

  return (
    <div className={clsx('flex justify-start items-start gap-2', className)}>
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-bold text-white uppercase shrink-0',
          sizeClasses[size],
          color,
        )}
      >
        {initials || ''}
      </div>
      <div className="overflow-hidden">
        <h4 className="capitalize text-start">{name || ' '}</h4>
        <p className="p14 leading-[1em] lowercase text-start">
          {details || ' '}
        </p>
      </div>
    </div>
  );
};

export default Avatar;
