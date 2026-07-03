import type { BookQueryParams, PaginationParams } from '@/types';

/**
 * TanStack Query key factories.
 * Every query must use keys from here so cache invalidation is predictable.
 */
export const queryKeys = {
  // ── Auth ──
  auth: {
    me: ['auth', 'me'] as const,
  },

  // ── Books ──
  books: {
    all: ['books'] as const,
    list: (params?: BookQueryParams) => ['books', 'list', params] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
  },

  // ── Categories ──
  categories: {
    all: ['categories'] as const,
    list: (params?: PaginationParams) =>
      ['categories', 'list', params] as const,
  },

  // ── Reviews ──
  reviews: {
    byBook: (bookId: string) => ['reviews', bookId] as const,
  },

  // ── Circulation ──
  circulation: {
    myIssues: ['circulation', 'my-issues'] as const,
    history: ['circulation', 'history'] as const,
  },

  // ── Dashboard ──
  dashboard: {
    shared: ['dashboard', 'shared'] as const,
    mine: ['dashboard', 'mine'] as const,
  },

  // ── Reports ──
  reports: {
    issuedBooks: ['reports', 'issued-books'] as const,
    overdue: ['reports', 'overdue'] as const,
    topBooks: ['reports', 'top-books'] as const,
  },

  // ── Users ──
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },

  // ── Payments ──
  payments: {
    history: ['payments', 'history'] as const,
  },
} as const;
