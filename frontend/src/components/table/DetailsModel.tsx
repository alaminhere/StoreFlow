import { X } from '@/helpers/icon/icon';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface PopupModalProps {
  className?: string;
  onClose: () => void;
  children?: ReactNode;
  open: boolean;
  label?: string;
}

const DetailsModel = ({
  className,
  onClose,
  children,
  open,
  label,
}: PopupModalProps) => {
  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-40 bg-background/10 backdrop-blur-sm',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
          className,
        )}
      />

      <div
        className={clsx(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="text-xl">{label}</h3>
          <button onClick={onClose} className="cursor-pointer text-text-muted">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 scrollbar-thin scrollbar-thumb-border overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default DetailsModel;
