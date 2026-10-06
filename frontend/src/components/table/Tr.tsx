import clsx from 'clsx';
import React, { ReactNode } from 'react';

const Tr = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <tr
      {...props}
      className={clsx(
        'border-b border-border hover:bg-sidebar-active-bg',
        className,
      )}
    >
      {children}
    </tr>
  );
};

export default Tr;
