import { FieldError, Merge } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import Label from './label';
import { AlertTriangle } from '@/helpers/icon/icon';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

const Input = ({ className, label, error, ...props }: Props) => {
  return (
    <div className="w-full">
      {label && <Label label={label} />}

      <input
        className={clsx(
          'w-full border border-border rounded-[10px] px-5 py-3  placeholder:text-placeholder bg-surface',
          'focus:outline-1 outline-primary focus:ring-4 ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed',
          error &&
            'border-danger ring-border-danger focus:ring-0! focus:outline-0! ',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="mt-1 p14 text-danger lowercase flex items-center gap-1">
          <AlertTriangle size={12} className=" text-danger!  " />
          {error?.message}
        </span>
      )}
    </div>
  );
};

export default Input;
