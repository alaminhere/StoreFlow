import Logo from '../../shared/SiteLogo';
import PublicMobileMenu from './PublicMobileMenu';
import ThemeToggle from '../../shared/ThemeToggle';
import NavButton from './PublicNavButton';
import PublicDesktopMenu from './PublicDesktopMenu';

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
        <PublicDesktopMenu MenuItem={MenuItems} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NavButton />
          {/* Mobile Menu */}
          <PublicMobileMenu className="flex md:hidden" menuItems={MenuItems} />
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
