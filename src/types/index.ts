// ============================================================
// TypeScript interfaces matching the Prisma schema models
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string | null;
  joinDate: string;
  maxBooksAllowed: number;
  fineBalance: number | string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
  issues?: IssueReturn[];
  fines?: Fine[];
}

/** User object returned after sanitize (password removed) */
export type SafeUser = Omit<User, 'password'>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  books?: Pick<Book, 'id' | 'title' | 'bookImage'>[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  shelfNo: string;
  totalCopies: number;
  availableCopies: number;
  bookImage: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  book?: Book | Pick<Book, 'title'>;
  user?: Pick<User, 'id' | 'name' | 'profileImage'>;
}

export interface IssueReturn {
  id: string;
  bookId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  fineAmount: number | string;
  isReturned: boolean;
  createdAt: string;
  updatedAt: string;
  book?: Book;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  fine?: Fine;
}

export interface Fine {
  id: string;
  issueReturnId: string;
  userId: string;
  amount: number | string;
  isPaid: boolean;
  paidDate: string | null;
  createdAt: string;
  updatedAt: string;
  issueReturn?: Pick<IssueReturn, 'id' | 'dueDate' | 'returnDate' | 'isReturned'> & {
    book?: Pick<Book, 'id' | 'title' | 'bookImage'>;
  };
}

// ---- Request DTOs ----

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  shelfNo: string;
  totalCopies: number;
  bookImage: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description: string;
  categoryImage: string;
}

export interface CreateReviewPayload {
  bookId: string;
  rating: number;
  comment: string;
}

export interface IssueBookPayload {
  bookId: string;
  userId: string;
  issueDate?: string;
  dueDate?: string;
}

export interface UpdateIssueDueDatePayload {
  issueId: string;
  dueDate: string;
}

export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  language?: string;
  sortBy?: 'title_asc' | 'rating_desc' | 'year_desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ---- Response types ----

export interface LoginResponse {
  accessToken: string;
  user: SafeUser;
}

export interface RegisterResponse {
  message: string;
  user: SafeUser;
}

export interface ProfileUpdateResponse {
  message: string;
  user: SafeUser;
}

export interface SharedDashboardResponse {
  totalBooks: number;
  totalUsers: number;
  activeIssues: number;
  totalPendingFines: number | string;
  lowStockBooks: Pick<Book, 'id' | 'title' | 'availableCopies'>[];
}

export interface MyDashboardResponse {
  profile: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'joinDate' | 'fineBalance' | 'profileImage'>;
  activeIssues: IssueReturn[];
  myReviews: Review[];
  myFines: Fine[];
}

export interface TriggerOverdueResponse {
  message: string;
  checked: number;
  processed: number;
  emailsSent: number;
  emailFailures: number;
  activeIssueCount?: number;
  nextDueDate?: string | null;
}

export interface PayFineResponse {
  message: string;
  fine: Fine;
}

export interface UploadResponse {
  message: string;
  bucket: string;
  region: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  size: number;
  allowedMimeTypes: string[];
  maxFileSizeBytes: number;
}
