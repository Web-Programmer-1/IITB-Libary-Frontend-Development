'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
  Library,
  Grid3X3,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

const publicLinks = [
  { href: '/', label: 'Home', icon: Library },
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/categories', label: 'Categories', icon: Grid3X3 },
];

const authLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-dashboard', label: 'My Space', icon: User },
  { href: '/circulation', label: 'Circulation', icon: RefreshCw },
  { href: '/payments', label: 'Payments', icon: CreditCard },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const allLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  return (
    <nav className="nav-themed fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative overflow-hidden flex h-9 w-9 items-center justify-center rounded-lg bg-white transition-transform group-hover:scale-110 border border-[var(--card-border)] p-0.5 flex-shrink-0">
              <Image
                src="/iitb.jpeg"
                alt="IITB Logo"
                width={32}
                height={32}
                priority
                className="object-contain rounded-md"
              />
            </div>
            <span className="text-lg font-bold gradient-text whitespace-nowrap">
              IITB Library
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--card-bg-hover)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-all hover:bg-[var(--card-bg-hover)] hover:text-[var(--text-primary)]"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name || 'User'}
                      className="h-7 w-7 rounded-full object-cover border border-[var(--card-border)] bg-[var(--bg-secondary)] flex-shrink-0"
                    />
                  ) : (
                    <div className="avatar-themed flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition-all hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-all hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-themed flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--card-border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 py-3">
            {allLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--card-bg-hover)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-[var(--card-border)] pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-themed flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
