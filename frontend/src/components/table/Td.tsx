import clsx from 'clsx';
import { ReactNode } from 'react';

const Td = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <td
      {...props}
      className={clsx(
        'px-3 py-3.5 whitespace-nowrap p14',
        className,
      )}
    >
      {children}
    </td>
  );
};

export default Td;
