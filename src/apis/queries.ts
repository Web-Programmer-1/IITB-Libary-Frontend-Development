'use client';

import { useQuery } from '@tanstack/react-query';
import api from './apis';
import { ENDPOINTS } from './endpoints';
import { queryKeys } from './keys';
import type {
  Book,
  BookQueryParams,
  Category,
  IssueReturn,
  MyDashboardResponse,
  PaginationParams,
  Review,
  SafeUser,
  SharedDashboardResponse,
} from '@/types';

// ── Auth ──

export const useMe = () =>
  useQuery<SafeUser>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.AUTH.ME);
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

// ── Books ──

export const useBooks = (params?: BookQueryParams) =>
  useQuery<Book[]>({
    queryKey: queryKeys.books.list(params),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.BOOKS.LIST, { params });
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });

export const useBookDetail = (id: string) =>
  useQuery<Book>({
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.BOOKS.DETAIL(id));
      return data;
    },
    enabled: !!id,
  });

// ── Categories ──

export const useCategories = (params?: PaginationParams) =>
  useQuery<Category[]>({
    queryKey: queryKeys.categories.list(params),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.CATEGORIES.LIST, { params });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

// ── Reviews ──

export const useBookReviews = (bookId: string) =>
  useQuery<Review[]>({
    queryKey: queryKeys.reviews.byBook(bookId),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.REVIEWS.BY_BOOK(bookId));
      return data;
    },
    enabled: !!bookId,
  });

// ── Circulation ──

export const useMyIssues = () =>
  useQuery<IssueReturn[]>({
    queryKey: queryKeys.circulation.myIssues,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.CIRCULATION.MY_ISSUES);
      return data;
    },
  });

export const useIssueHistory = () =>
  useQuery<IssueReturn[]>({
    queryKey: queryKeys.circulation.history,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.CIRCULATION.HISTORY);
      return data;
    },
  });

// ── Dashboard ──

export const useSharedDashboard = () =>
  useQuery<SharedDashboardResponse>({
    queryKey: queryKeys.dashboard.shared,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.DASHBOARD.SHARED);
      return data;
    },
  });

export const useMyDashboard = () =>
  useQuery<MyDashboardResponse>({
    queryKey: queryKeys.dashboard.mine,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.DASHBOARD.MINE);
      return data;
    },
  });

// ── Reports ──

export const useIssuedBooksReport = () =>
  useQuery<IssueReturn[]>({
    queryKey: queryKeys.reports.issuedBooks,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.REPORTS.ISSUED_BOOKS);
      return data;
    },
  });

export const useOverdueReport = () =>
  useQuery<IssueReturn[]>({
    queryKey: queryKeys.reports.overdue,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.REPORTS.OVERDUE);
      return data;
    },
  });

export const useTopBooks = () =>
  useQuery<(Book & { _count: { issues: number } })[]>({
    queryKey: queryKeys.reports.topBooks,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.REPORTS.TOP_BOOKS);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

// ── Users ──

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.USERS.LIST);
      return data;
    },
  });

export const useUserDetail = (id: string) =>
  useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.USERS.DETAIL(id));
      return data;
    },
    enabled: !!id,
  });
