'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SiteContent } from '@/types';

interface HeaderProps {
  siteContent: SiteContent;
  user?: {
    email: string;
    role: 'guest' | 'host';
  } | null;
}

export function Header({ siteContent, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-3xl font-semibold tracking-wide text-neutral-100">
            {siteContent.appName}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {siteContent.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors',
                  isActive(link.href)
                    ? 'text-neutral-100 border-b border-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={user.role === 'host' ? '/dashboard/host' : '/dashboard/guest'}
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-sm text-neutral-400 hover:text-neutral-200"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-neutral-400 hover:text-neutral-200"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-900">
            <nav className="flex flex-col py-3">
              {siteContent.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm transition-colors',
                    isActive(link.href)
                      ? 'text-neutral-100 bg-neutral-800'
                      : 'text-neutral-400 hover:text-neutral-200'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-neutral-800 pt-2">
                {user ? (
                  <>
                    <Link
                      href={user.role === 'host' ? '/dashboard/host' : '/dashboard/guest'}
                      className="block px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
                      >
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="mx-4 mt-2 rounded-md bg-neutral-100 px-4 py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
