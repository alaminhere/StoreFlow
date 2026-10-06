import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import Label from './label';
import { FieldError, Merge } from 'react-hook-form';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  label?: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

const Select = ({ className, label, error, ...props }: Props) => {
  return (
    <div className="w-full">
      {label && <Label label={label} />}

      <select
        className={clsx(
          'w-full border border-border rounded-[10px] px-4 py-3.5 text-text',
          'focus:outline-1 outline-primary focus:ring-4 ring-primary/20',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {error && <span className="p14 text-danger">{error?.message}</span>}
    </div>
  );
};

export default Select;
