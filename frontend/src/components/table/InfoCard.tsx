const InfoCard = ({
  label = '',
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className="w-full rounded-lg border border-border bg-surface px-4 py-3">
    <p className={`p12 ${className}`}>{label}</p>
    <p className={`mt-1 p14 text-text ${className}`}>{value}</p>
  </div>
);
export default InfoCard;
