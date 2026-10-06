import clsx from 'clsx';

const BadgeVariant = {
  primary: 'bg-primary text-white',
  secondary: 'bg-surface text-text-muted hover:text-text',
};

type BadgeVariant = keyof typeof BadgeVariant;

const Badge = ({
  className,
  label,
  variant = 'primary',
}: {
  className?: string;
  label?: string;
  variant?: BadgeVariant;
}) => {
  const variantClass = BadgeVariant[variant];
  return (
    <div
      className={clsx(
        'w-fit text-base px-2 py-2 leading-3 rounded-[5px]',
        variantClass,
        className,
      )}
    >
      {label}
    </div>
  );
};

export default Badge;
