'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/apis/mutations';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const loginMutation = useLogin();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    loginMutation.mutate(form, {
      onSuccess: (data) => {
        authLogin(data.accessToken, data.user);
        toast.success('Welcome back!');
        router.push('/my-dashboard');
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Invalid credentials',
        );
      },
    });
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: 'var(--accent-glow)' }}
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full blur-[120px]"
        style={{ background: 'var(--accent-glow-2)' }}
      />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="logo-themed mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Sign in to your IITB Library account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<Lock className="h-4 w-4" />}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
