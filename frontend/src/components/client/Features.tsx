import {
  ChartColumn,
  Package,
  ShoppingCart,
  FileText,
  Truck,
} from '@/helpers/icon/icon';
import Card from '../ui/card';
import clsx from 'clsx';

const FEATURE_CARD = [
  {
    color: 'bg-primary',
    icon: Package,
    title: 'Product Management',
    description:
      'Track products with SKUs, braces, categories, brands, and real-time stock levels.',
  },
  {
    color: 'bg-success',
    icon: ShoppingCart,
    title: 'POS & Sales',
    description:
      'Complete point-of-sale interface with cart, barcode scanning, and multiple payment methods.',
  },
  {
    color: 'bg-danger',
    icon: FileText,
    title: 'Invoicing',
    description:
      'Generate professional invoices with custom templates, taxes, and one-click PDF download..',
  },
  {
    color: 'bg-warning',
    icon: Truck,
    title: 'Supplier & Purchase',
    description:
      'Track suppliers, purchase orders, payments, and outstanding dues in one place.',
  },
  {
    color: 'bg-accent',
    icon: Truck,
    title: 'Customer CRM',
    description:
      'Manage customer profiles, order history, payment tracking, and purchase analytics.',
  },
  {
    color: 'bg-info',
    icon: ChartColumn,
    title: 'Reports & Analytics',
    description:
      '12+ report types with charts, filters, and export options for informed decisions.',
  },
];

const Features = () => {
  return (
    <section id="features">
      <div className="app-container">
        <div>
          <p className="animate-slide-up mb-2 uppercase text-primary font-medium">
            Future
          </p>
          <h2 className="animate-slide-up">Everything Your Business Needs</h2>
          <p className="animate-slide-up mt-1 w-full md:w-[50%]">
            From inventory tracking to invoicing, Stockpile gives you all the
            tools in one powerful, easy-to-use platform.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURE_CARD.map((item, index) => (
            <Card key={index} className=" group  bg-primary-fade">
              <div className="">
                <item.icon
                  size={45}
                  className={clsx(
                    'text-white p-2 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-100',
                    item.color,
                  )}
                />
              </div>
              <h4 className="animate-slide-up">{item.title}</h4>
              <p className="p14 animate-slide-up mt-1">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
