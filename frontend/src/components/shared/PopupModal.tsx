

import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PopupModalProps {
  className?: string;
  onClose: () => void;
  children?: ReactNode;
  label?: string | ReactNode;
}

const PopupModal = ({ className, onClose, children, label }: PopupModalProps) => {
  const [shown, setShown] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setShown(true), 10);
    return () => clearTimeout(t);
  }, []);


  const handleClose = () => {
    setShown(false);
    setTimeout(onClose, 200);
  };

  return createPortal(
    <div
      className={clsx(
        'p-5 fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-1000 transition-opacity duration-300',
        shown ? 'opacity-100' : 'opacity-0',
      )}
      onClick={handleClose}
    >
      <div
        className={clsx(
          'bg-surface border border-border rounded-2xl w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col transition-all duration-300',
          shown ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95',
          className,
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-3 border-b border-border shrink-0">
          <h4 className="text-xl capitalize">{label || 'Add Supplier'}</h4>
          <button className="cursor-pointer text-text-muted" onClick={handleClose}>
            ✕
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-border p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PopupModal;