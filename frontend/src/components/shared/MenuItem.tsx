import { ReactNode, cloneElement, isValidElement } from 'react';
import clsx from 'clsx';

const MenuItem = ({
  className,
  icon,
  label,
  danger,
  active,
  onClick,
}: {
  className?: string;
  icon: ReactNode;
  label: string;
  danger?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  const styledIcon = isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: clsx(
          (icon.props as { className?: string })?.className,
          active && 'text-primary!',
          !active &&
            (danger ? 'group-hover:text-danger!' : 'group-hover:text-primary!'),
        ),
      })
    : icon;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center w-full  rounded-md text-base! py-1.5! gap-3 px-3 ',
        'transition-colors duration-150 cursor-pointer',
        active
          ? 'bg-sidebar-active-bg! text-primary!'
          : danger
            ? 'text-danger hover:bg-danger/10 hover:text-danger'
            : 'text-sidebar-text hover:bg-sidebar-active-bg hover:text-primary',
        className,
      )}
    >
      {styledIcon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default MenuItem;
