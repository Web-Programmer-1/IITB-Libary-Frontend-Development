'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from './apis';
import { ENDPOINTS } from './endpoints';
import { queryKeys } from './keys';
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  UpdateProfilePayload,
  ProfileUpdateResponse,
  CreateBookPayload,
  CreateCategoryPayload,
  CreateReviewPayload,
  IssueBookPayload,
  UpdateIssueDueDatePayload,
  InitPaymentResponse,
  Book,
  Category,
  IssueReturn,
} from '@/types';

// ── Auth Mutations ──

export const useRegister = () =>
  useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);
      return data;
    },
  });

export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileUpdateResponse, Error, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.put(ENDPOINTS.AUTH.PROFILE, payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

// ── Book Mutations ──

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation<Book, Error, CreateBookPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.BOOKS.CREATE, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.BOOKS.DELETE(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
};

// ── Category Mutations ──

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.CATEGORIES.CREATE, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete(ENDPOINTS.CATEGORIES.DELETE(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
};

// ── Review Mutations ──

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateReviewPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.REVIEWS.CREATE, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byBook(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.detail(variables.bookId),
      });
    },
  });
};

// ── Circulation Mutations ──

export const useIssueBook = () => {
  const queryClient = useQueryClient();

  return useMutation<IssueReturn, Error, IssueBookPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(ENDPOINTS.CIRCULATION.ISSUE, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.myIssues,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.history,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.shared });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.mine });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation<IssueReturn, Error, string>({
    mutationFn: async (issueId) => {
      const { data } = await api.put(ENDPOINTS.CIRCULATION.RETURN(issueId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.myIssues,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.history,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.shared });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.mine });
    },
  });
};

export const useUpdateIssueDueDate = () => {
  const queryClient = useQueryClient();

  return useMutation<IssueReturn, Error, UpdateIssueDueDatePayload>({
    mutationFn: async ({ issueId, dueDate }) => {
      const { data } = await api.patch(
        ENDPOINTS.CIRCULATION.UPDATE_DUE_DATE(issueId),
        { dueDate },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.myIssues,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.circulation.history,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.shared });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useInitiatePayment = () => {
  return useMutation<InitPaymentResponse, Error, string>({
    mutationFn: async (fineId) => {
      const { data } = await api.post(ENDPOINTS.PAYMENT.INIT(fineId));
      return data;
    },
  });
};

export const useInitiateBookPayment = () => {
  return useMutation<InitPaymentResponse, Error, string>({
    mutationFn: async (bookId) => {
      const { data } = await api.post(ENDPOINTS.PAYMENT.INIT_BOOK(bookId));
      return data;
    },
  });
};

// ── Upload Mutations ──

export const useUploadImage = (type: 'profile-image' | 'book-image' | 'category-image') => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: {
          key: '2b99cb8f34d858d23cb6fa41faf4faa8',
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (!data.success) {
        throw new Error(data.error?.message || 'ImgBB upload failed');
      }

      return {
        url: data.data.url,
      };
    },
  });
};
