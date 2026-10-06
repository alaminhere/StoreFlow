

import Logo from '../shared/SiteLogo';
import { ChartColumn, FileText } from '@/helpers/icon/icon';

const FEATURES = [
  {
    icon: FileText,
    title: 'Live Inventory',
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
];

const Showcase = () => {
  return (
    <div className="hidden w-full flex-col items-start justify-center gap-5 border-r border-border bg-surface p-12 md:flex md:w-1/2">
      <Logo />
      <div className="mt-5 animate-slide-up text-start">
        <h2>
          Your inventory, <br />
          <span className="text-primary">fully in control.</span>
        </h2>
        <p className="mt-2 mb-5">Track, sell, and grow all in one place.</p>
      </div>

      <div className="flex w-full flex-col gap-5">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            className={`flex w-full animate-slide-up items-start gap-3 pb-3 ${i !== FEATURES.length - 1 ? 'border-b border-border' : ''
              }`}
          >
            <feature.icon
              size={36}
              className={`flex shrink-0 items-center justify-center rounded-lg p-2 ${feature.iconBg} ${feature.iconColor}`}
            />{' '}
            <div>
              <p className="text-sm text-text">{feature.title}</p>
              <p className="p14">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="hidden p14 md:block">
          Designed & Developed By {" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://alaminhere.com"
            className="p14 text-primary underline"
          >
            MD.Al-Amin
          </a>
        </p>
      </div>
    </div>
  );
};

export default Showcase;
