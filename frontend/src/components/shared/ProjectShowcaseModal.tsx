import Logo from './SiteLogo';
import Button from '../ui/button';
import PopupModal from './PopupModal';
import { GitHub, Globe, Linkedin } from '@/helpers/icon/icon';

const LINKS = {
  portfolio: 'https://alaminhere.com/',
  linkedin: 'https://www.linkedin.com/in/alamin-here',
  github: 'https://github.com/alaminhere/StoreFlow',
};

const FEATURES = [
  'Multi-store inventory management',
  'POS with real-time stock updates',
  'Role-based access for owners and staff',
  'PDF invoices and sales analytics',
];

const TECH_GROUPS = [
  {
    title: 'Frontend',
    items: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'RTK Query',
      'React Hook Form',
      'Chart.js',
      'jsPDF',
    ],
  },
  {
    title: 'Backend',
    items: [
      'Node.js',
      'Express 5',
      'Socket.IO',
      'JWT',
      'bcrypt',
      'Zod',
      'Rate limiting',
      'CORS',
    ],
  },
  {
    title: 'Database and services',
    items: ['MySQL', 'Prisma ORM', 'Cloudinary', 'Multer', 'Resend'],
  },
];

const LinkButton = ({
  href,
  icon: Icon,
  iconClass = 'text-text!',
  variant,
  children,
}: {
  href: string;
  icon: typeof Globe;
  iconClass?: string;
  variant?: 'secondary';
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-xl"
  >
    <Button size="sm" variant={variant} className="w-full">
      <Icon className={iconClass} size={20} aria-hidden /> {children}
    </Button>
  </a>
);

const ProjectShowcaseModal = ({ onClose }: { onClose: () => void }) => (
  <PopupModal onClose={onClose} className="max-w-190!" label={<Logo />}>
    <div className="max-h-[60dvh] overflow-y-auto pr-1 scrollbar-thin">
      <h3 className="text-2xl">Built with Modern Web Technologies</h3>
      <p className="mt-1 md:max-w-[80%] p14">
        StoreFlow is an inventory management system for growing businesses.
      </p>

      <section className="mt-4">
        <h4>Key features</h4>
        <ul className="mt-1 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          {FEATURES.map(feature => (
            <li key={feature} className="flex items-start gap-2 p14">
              <span
                aria-hidden
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
              />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3.5">
        <h4>Try the live demo</h4>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 p14">
          <span>
            Email:{' '}
            <code className="rounded bg-background px-1.5 py-0.5 text-text">
              demo@example.com
            </code>
          </span>
          <span>
            Password:{' '}
            <code className="rounded bg-background px-1.5 py-0.5 text-text">
              12345
            </code>
          </span>
        </p>

        <p className="mt-2 p14">
          After signing in, you will see a{' '}
          <strong className="font-medium text-text">Store List</strong>. Choose
          one:
        </p>

        <ul className="mt-1.5 space-y-1 p14">
          <li className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            />
            <span>
              <strong className="font-medium text-text">Store A</strong> opens
              as Owner with full access.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            />
            <span>
              <strong className="font-medium text-text">Store B</strong> opens
              as Manager with limited access.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-4 space-y-3">
        {TECH_GROUPS.map(group => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {group.items.map(item => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 p12"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>

    <div className="shrink-0 pt-3">
      <nav className="space-y-2.5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <LinkButton href={LINKS.portfolio} icon={Globe} variant="secondary">
            Explore My Portfolio
          </LinkButton>
          <LinkButton href={LINKS.linkedin} icon={Linkedin} variant="secondary">
            Connect on LinkedIn
          </LinkButton>
        </div>
        <LinkButton
          href={LINKS.github}
          icon={GitHub}
          iconClass="text-btn-primary-text!"
        >
          View Source Code
        </LinkButton>
      </nav>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-2.5 p12 text-text-muted md:justify-between">
        <span>
          Designed &amp; Developed by{' '}
          <a
            href={LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Md. Al-Amin
          </a>
        </span>
        <span className="rounded-md border border-border px-2 py-0.5">
          Full-Stack Developer
        </span>
      </div>
    </div>
  </PopupModal>
);

export default ProjectShowcaseModal;
