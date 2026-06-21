/**
 * Centralised API endpoint constants.
 * Matches the NestJS backend routes defined with @Controller decorators.
 */
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },

  BOOKS: {
    LIST: '/books',
    DETAIL: (id: string) => `/books/${id}`,
    CREATE: '/books',
    DELETE: (id: string) => `/books/${id}`,
  },

  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DELETE: (id: string) => `/categories/${id}`,
  },

  REVIEWS: {
    BY_BOOK: (bookId: string) => `/books/${bookId}/reviews`,
    CREATE: '/reviews',
  },

  CIRCULATION: {
    ISSUE: '/issue',
    RETURN: (id: string) => `/return/${id}`,
    UPDATE_DUE_DATE: (id: string) => `/issue/${id}/due-date`,
    MY_ISSUES: '/my-issues',
    HISTORY: '/issue-history',
    TRIGGER_OVERDUE: '/circulation/trigger-overdue',
  },

  DASHBOARD: {
    SHARED: '/dashboard',
    MINE: '/my-dashboard',
    PAY_FINE: (id: string) => `/my-fines/${id}/pay`,
  },

  REPORTS: {
    ISSUED_BOOKS: '/reports/issued-books',
    OVERDUE: '/reports/overdue',
    TOP_BOOKS: '/reports/top-books',
  },

  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },

  UPLOADS: {
    PROFILE_IMAGE: '/uploads/profile-image',
    BOOK_IMAGE: '/uploads/book-image',
    CATEGORY_IMAGE: '/uploads/category-image',
  },
} as const;
