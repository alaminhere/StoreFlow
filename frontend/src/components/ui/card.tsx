import clsx from 'clsx';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, className, ...props }: Props) => {
  return (
    <div
      {...props}
      className={clsx(
        'w-full bg-surface border border-border rounded-2xl p-5 hover:border-primary/30',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
