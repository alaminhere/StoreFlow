import { ReactNode } from 'react';
import clsx from 'clsx';

const Th = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <th
      {...props}
      className={clsx(
        'px-3 py-3.5 font-medium  p14 whitespace-nowrap',
        className,
      )}
    >
      {children}
    </th>
  );
};

export default Th;
