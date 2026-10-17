'use client';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';
import Link from 'next/link';

type MenuItem = {
  label: string;
  href: string;
};

const PublicDesktopMenu = ({ MenuItem }: { MenuItem: MenuItem[] }) => {
  const { user, store, isLoading } = useCurrentUserContext();
  return (
    <nav className="hidden md:flex items-center gap-5">
      {MenuItem.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="text-text text-base hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
      {!isLoading && user && !store ? (
        <Link
          className="text-text text-base hover:text-primary"
          href="/profile"
        >
          Profile
        </Link>
      ) : (
        !isLoading &&
        user &&
        store && (
          <Link
            className="text-text text-base hover:text-primary"
            href="/dashboard"
          >
            Dashboard
          </Link>
        )
      )}
    </nav>
  );
};

export default PublicDesktopMenu;
