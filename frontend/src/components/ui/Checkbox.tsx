import { FieldError, Merge } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Check } from '@/helpers/icon/icon';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  label?: string;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

const Checkbox = ({ className, label, error, id, ...props }: Props) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={clsx(
          'flex items-center gap-2.5 cursor-pointer w-fit',
          props.disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <div className="relative flex items-center justify-center ">
          <input
            id={id}
            type="checkbox"
            className={clsx(
              'peer appearance-none w-5 h-5 shrink-0 rounded-md border border-text/20 bg-surface',
              'checked:bg-primary checked:border-primary',
              'focus:outline-1 outline-primary focus:ring-4 ring-primary/20',
              'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer',
              error &&
                'border-danger ring-border-danger focus:ring-0! focus:outline-0!',
              className,
            )}
            {...props}
          />
          <Check
            size={14}
            strokeWidth={3}
            className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
          />
        </div>

        {label && (
          <span className="text-text-muted p14 select-none">{label}</span>
        )}
      </label>

      {error && <span className="p14 text-danger">{error?.message}</span>}
    </div>
  );
};

export default Checkbox;
