import { Trash2 } from '@/helpers/icon/icon';

type Props = {
  count: number;
  onDelete: () => void;
  onClear: () => void;
};

const BulkActionBar = ({ count, onDelete, onClear }: Props) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-sidebar-active-bg border-b border-border">
      <span className="p14 text-text">
        {count} {count > 1 ? 'items' : 'item'} selected
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-danger cursor-pointer"
        >
          <Trash2 size={14} className="text-danger!" />
          Delete
        </button>
        <button onClick={onClear} className="text-text-muted cursor-pointer">
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
