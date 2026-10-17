import Logo from '../shared/SiteLogo';
import { ChartColumn, FileText, Package } from '@/helpers/icon/icon';

const FEATURES = [
  {
    icon: Package,
    title: 'Live inventory',
    description: 'Track your stock at a glance.',
    iconColor: 'text-success!',
    iconBg: 'bg-success-bg',
  },
  {
    icon: ChartColumn,
    title: 'Smart analytics',
    description: 'Track sales and growth with clear reports.',
    iconColor: 'text-accent!',
    iconBg: 'bg-accent-bg',
  },
  {
    icon: FileText,
    title: 'Instant invoices',
    description: 'Generate and download PDF invoices in a click.',
    iconColor: 'text-warning!',
    iconBg: 'bg-warning-bg',
  },
];

const HIGHLIGHTS = ['Multi-store', 'Real-time', 'Secure'];

const Showcase = () => {
  return (
    <div className="relative hidden w-full flex-col items-start justify-start gap-5 overflow-hidden border-r border-border bg-primary-fade p-12 md:flex md:w-1/2">
      <div className="relative flex w-full flex-1 flex-col items-start gap-5">
        <Logo />
        <div className="animate-slide-up text-start mt-2">
          <h2 className="font-bold">
            Your inventory, <br />
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              fully in control.
            </span>
          </h2>
          <p className="mt-2 mb-5">Track, sell, and grow all in one place.</p>
        </div>
        <ul className="flex w-full flex-col gap-3 ">
          {FEATURES.map((feature, i) => (
            <li
              key={feature.title}
              style={{ animationDelay: `${i * 120}ms` }}
              className="  flex w-full items-start gap-3 rounded-xl border border-border bg-surface  p-3 duration-300 hover:border-primary/40 hover:bg-background/50 animate-slide-up"
            >
              <feature.icon
                size={40}
                className={`p-2 rounded-md ${feature.iconBg} ${feature.iconColor}`}
              />
              <div>
                <h4>{feature.title}</h4>
                <p className="p14">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-2">
          {HIGHLIGHTS.map(item => (
            <li
              key={item}
              className="rounded-md border border-border bg-surface px-2.5 py-1 p12 "
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto w-full border-t border-border pt-4">
          <p className="hidden p14 md:block">
            Designed &amp; Developed by{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://alaminhere.com"
              className="p14 text-primary underline"
            >
              Md. Al-Amin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
