import Link from 'next/link';
import Logo from '../../shared/SiteLogo';
import PublicMobileMenu from './PublicMobileMenu';
import ThemeToggle from '../../shared/ThemeToggle';
import NavButton from './PublicNavButton';

const MenuItems = [
  {
    label: 'Features',
    href: '/#features',
  },
  {
    label: 'Pricing',
    href: '/#pricing',
  },
  {
    label: 'Testimonials',
    href: '/#testimonials',
  },
];
const PublicHeader = () => {
  return (
    <header className=" bg-background/30 backdrop-blur-xl fixed top-0 left-0 right-0 border-b border-border z-100">
      <div className="app-container text-text px-5 py-5  flex justify-between items-center">
        <Logo />

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-5">
          {MenuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text text-base hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavButton />
          <PublicMobileMenu className="flex md:hidden" menuItems={MenuItems} />
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
