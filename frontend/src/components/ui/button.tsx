import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader } from '@/helpers/icon/icon';
import clsx from 'clsx';

const variantClass: VariantClass = {
  primary: 'bg-btn-primary-bg text-btn-primary-text hover:bg-primary-hover',
  secondary: 'bg-btn-secondary-bg text-btn-secondary-text border border-border',
  danger: 'bg-btn-danger-bg text-btn-danger-text border border-border',
};
const SizeClass: SizeClass = {
  md: 'px-5 py-2.5 rounded-[9px]',
  sm: 'px-4 py-1.5 rounded-[9px]',
};

interface VariantClass {
  primary: string;
  secondary: string;
  danger: string;
}
interface SizeClass {
  md: string;
  sm: string;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: keyof typeof SizeClass;
  variant?: keyof typeof variantClass;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  className,
  type = 'button',
  size = 'sm',
  variant = 'primary',
  disabled = false,
  loading = false,
  ...props
}: Props) => {
  const selectedVariant = variantClass[variant];
  const selectedSize = SizeClass[size];
  return (
    <>
      <button
        className={clsx(
          'text-base font-normal  font-dm-sans h-fit flex shrink-0 items-center justify-center gap-2 tracking-wide',
          'active:scale-90 disabled:cursor-not-allowed transition-all duration-300',
          selectedVariant,
          className,
          selectedSize,
          loading ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        disabled={disabled || loading}
        {...props}
        type={type}
      >
        {loading && <Loader size={18} className="text-text! animate-spin" />}

        {loading ? 'Loading...' : children}
      </button>
    </>
  );
};
export default Button;
