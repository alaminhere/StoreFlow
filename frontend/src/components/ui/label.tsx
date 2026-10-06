import clsx from 'clsx';

const Label = ({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) => {
  return (
    <label
      className={clsx(
        'text-text mb-1.5 block font-normal capitalize ',
        className,
      )}
    >
      {label}
    </label>
  );
};

export default Label;
