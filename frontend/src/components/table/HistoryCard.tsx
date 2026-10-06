const HistoryCard = ({
  historyId,
  date,
  itemCount,
  amount,
  paymentMethod,
  className,
}: {
  historyId: string;
  date: string;
  itemCount?: number;
  amount: string | number;
  paymentMethod?: string;
  className?: string;
}) => (
  <div
    className={`w-full rounded-lg border border-border bg-surface px-4 py-3 ${className}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="p14 font-medium text-text">{historyId}</p>
        <div className="p12 mt-1 flex items-center gap-2 text-muted">
          <span>{date}</span>
          {itemCount && (
            <>
              <span>·</span>
              <span>{itemCount} items</span>
            </>
          )}
          <span>·</span>
          <span className="rounded bg-warning-bg px-2 py-0.5 text-xs font-medium text-warning">
            {paymentMethod}
          </span>
        </div>
      </div>

      <p className="p14 font-medium text-text">৳{amount}</p>
    </div>
  </div>
);

export default HistoryCard;
