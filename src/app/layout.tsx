import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/lib/providers';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'IITB Library — Digital Library Management System',
  description:
    'Browse, issue, and review books in the IITB digital library. A modern library management system with real-time availability tracking.',
  keywords: ['library', 'books', 'IITB', 'management', 'digital library'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
