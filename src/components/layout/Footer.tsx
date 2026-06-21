import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative overflow-hidden flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[var(--card-border)] p-0.5">
                <Image
                  src="/iitb.jpeg"
                  alt="IITB Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-md"
                />
              </div>
              <span className="text-lg font-bold gradient-text">
                IITB Library
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              A modern digital library management system for browsing, issuing,
              and reviewing books.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: '/books', label: 'Browse Books' },
                { href: '/categories', label: 'Categories' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/register', label: 'Create Account' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              About
            </h3>
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
              Built as a practice project for full-stack development with
              NestJS, Prisma, and Next.js.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--card-bg)] text-[var(--text-muted)] transition-all hover:bg-[var(--card-bg-hover)] hover:text-[var(--text-primary)]"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--card-border)] pt-8">
          <p className="text-center text-sm text-[var(--text-faint)]">
            Made with{' '}
            <Heart className="inline h-3.5 w-3.5 text-red-500 fill-red-500" />{' '}
            &copy; {new Date().getFullYear()} IITB Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
