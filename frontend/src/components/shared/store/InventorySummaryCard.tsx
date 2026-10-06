import clsx from 'clsx';

import Card from '@/components/ui/card';
import {
  Wallet,
  Package,
  CircleCheck,
  PackageX,
  AlertTriangle,
  XCircle,
} from '@/helpers/icon/icon';

const SUMMARY_ITEMS = [
  {
    icon: Wallet,
    iconBg: 'bg-accent',
    label: 'Total Stock Value',
    value: '1,158',
  },
  {
    icon: Package,
    iconBg: 'bg-success',
    label: 'Total Units',
    value: '1,158',
  },
  {
    icon: CircleCheck,
    iconBg: 'bg-primary',
    label: 'Available',
    value: '1,158',
  },
  {
    icon: PackageX,
    iconBg: 'bg-danger',
    label: 'Damaged',
    value: '1,158',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-warning',
    label: 'Low Stock',
    value: '1,158',
  },
  {
    icon: XCircle,
    iconBg: 'bg-danger',
    label: 'Out of Stock',
    value: '1,158',
  },
];

const InventorySummaryCard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-5">
      {SUMMARY_ITEMS.map(item => (
        <Card key={item.label}>
          <item.icon
            size={40}
            className={clsx('rounded-xl   text-white p-2', item.iconBg)}
          />
          <p className="p14 mt-4 mb-1">{item.label}</p>
          <h3 className="text-2xl font-semibold">{item.value}</h3>
        </Card>
      ))}
    </div>
  );
};

export default InventorySummaryCard;
