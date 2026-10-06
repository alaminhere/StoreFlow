import { ReactNode } from 'react';
import Logo from '../../shared/SiteLogo';
import { Email, FaceBook, GitHub, Globe, Linkedin } from '@/helpers/icon/icon';
import Link from 'next/link';

const IconHelper = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    className="bg-border w-fit p-1 rounded-md hover:bg-primary group transition-colors duration-300"
  >
    {children}
  </a>
);

const product = [
  {
    title: 'Features',
    href: '/#features',
  },
  {
    title: 'Pricing',
    href: '/#pricing',
  },
  {
    title: 'Testimonials',
    href: '/#testimonials',
  },
];

const Company = [
  {
    title: 'About',
    href: '#',
  },

  {
    title: 'Privacy',
    href: '#',
  },
  {
    title: 'Terms',
    href: '#',
  },
];
const Support = [
  {
    title: 'Help Center',
    href: '#',
  },
  {
    title: 'Contact Us',
    href: '#',
  },
];

const PublicFooter = () => {
  return (
    <footer className="bg-surface border border-border">
      <div className="app-container pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6">
          <div className="">
            <Logo />
            <p className="p14 mt-4 w-full md:w-[80%]">
              The complete inventory management platform for modern businesses
              in Bangladesh.
            </p>
            <div className="mt-5 flex gap-3">
              <IconHelper href="https://www.facebook.com/alaminhere001">
                <FaceBook className="group-hover:text-white!" />
              </IconHelper>
              <IconHelper href="https://github.com/alaminhere">
                <GitHub className="group-hover:text-white!" />
              </IconHelper>
              <IconHelper href="https://www.linkedin.com/in/alamin-here">
                <Linkedin className="group-hover:text-white!" />
              </IconHelper>
              <IconHelper href="mailto:hello@alaminhere.com">
                <Email className="group-hover:text-white!" />
              </IconHelper>
              <IconHelper href="https://alaminhere.com">
                <Globe className="group-hover:text-white!" />
              </IconHelper>
            </div>
          </div>
          <div className=" flex flex-col">
            <h4 className="mb-2">Product</h4>
            {product.map(item => (
              <Link
                href={item.href}
                key={item.title}
                className="p14 mt-2 hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className=" flex flex-col">
            <h4 className="mb-2">Company</h4>
            {Company.map(item => (
              <Link
                href={item.href}
                key={item.title}
                className="p14 mt-2 hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className=" flex flex-col">
            <h4 className="mb-2">Support</h4>
            {Support.map(item => (
              <Link
                href={item.href}
                key={item.title}
                className="p14 mt-2 hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>

        </div>
        <div className="mt-6 border-t border-border">
          <p className="p14 mt-6 text-center">
            © 2026 StoreFlow | Designed & Developed by {' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
              href="https://alaminhere.com"
            >
              Md. Al-Amin.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
