import { FieldError, Merge } from 'react-hook-form';
import { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import Label from './label';
import { AlertTriangle } from '@/helpers/icon/icon';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
}

const Textarea = ({ className, label, error, ...props }: Props) => {
  return (
    <div className="w-full">
      {label && <Label label={label} />}

      <textarea
        className={clsx(
          'w-full border border-border rounded-[10px] px-4 py-1.5  placeholder:text-placeholder',
          'focus:outline-1 outline-primary focus:ring-4 ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed',
          error && 'border-danger-text ring-border-danger-text focus:ring-0!',
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

export default Textarea;
