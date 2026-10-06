'use client';

import { clsx } from 'clsx';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

const Toggle = ({
  checked,
  onChange,
  disabled = false,
  className,
}: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative flex items-center h-6 w-11 rounded-full p-1 transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-60',
        checked ? 'bg-primary' : 'bg-border',
        className,
      )}
    >
      <span
        className={clsx(
          'block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 cursor-pointer',
          checked ? ' translate-x-5' : 'bg-primary! translate-x-0',
        )}
      />
    </button>
  );
};

export default Toggle;
