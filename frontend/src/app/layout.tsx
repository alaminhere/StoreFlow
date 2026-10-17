import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import NextThemeProvider from '@/providers/NextThemeProvider';
import ReduxProvider from '@/providers/ReduxProvider';
import SocketProvider from '@/providers/SocketProvider';

const inter = Space_Grotesk({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const PROJECT_IMAGE = '/storeFlow_overview_v1.webp';
const DESCRIPTION =
  'StoreFlow is a full-stack inventory and business management platform for businesses in Bangladesh. Manage products, multi-warehouse stock, sales, purchases, POS, invoices, suppliers, customers, returns, payments, and analytics in one platform.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'StoreFlow | Inventory & Business Management System',
  description: DESCRIPTION,
  keywords: [
    'StoreFlow',
    'Inventory Management System',
    'Inventory Software Bangladesh',
    'Stock Management Software',
    'Warehouse Management',
    'Multi-Warehouse Inventory',
    'POS Software',
    'Sales Management',
    'Purchase Management',
    'Invoice Management',
    'Supplier Management',
    'Customer Management',
    'Business Management Software',
    'Inventory Dashboard',
    'Full-Stack Web Application',
  ],

  authors: [
    {
      name: 'Md. Al-Amin',
      url: 'https://alaminhere.com',
    },
  ],

  creator: 'Md. Al-Amin',
  publisher: 'StoreFlow',

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: 'StoreFlow | Inventory & Business Management',
    description: DESCRIPTION,
    siteName: 'StoreFlow',
    url: SITE_URL,
    type: 'website',
    locale: 'en_US',

    images: [
      {
        url: PROJECT_IMAGE,
        width: 1200,
        height: 630,
        alt: 'StoreFlow Inventory Management Dashboard',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'StoreFlow | Inventory & Business Management',
    description: DESCRIPTION,
    images: [PROJECT_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
};

export const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',

  name: 'StoreFlow',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  image: `${SITE_URL}/storeFlow_overview_v1.webp`,
  description:
    'A full-stack inventory and business management platform built for businesses in Bangladesh.',
  author: {
    '@type': 'Person',
    name: 'Md. Al-Amin',
    url: 'https://alaminhere.com',
  },

  featureList: [
    'Product and Category Management',
    'Multi-Warehouse Inventory',
    'Point of Sale (POS)',
    'Sales and Purchase Management',
    'Invoice Generation and PDF Export',
    'Supplier and Customer Management',
    'Payments and Returns',
    'Reports and Analytics',
    'Member Roles and Permissions',
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmSans.variable} h-full antialiased selection:text-primary selection:bg-primary/10`}
    >
      <body className="min-h-full flex flex-col">
        <NextThemeProvider>
          <ReduxProvider>
            <SocketProvider>{children}</SocketProvider>
          </ReduxProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
