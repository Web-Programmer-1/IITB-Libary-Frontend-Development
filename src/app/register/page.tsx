'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, MapPin, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRegister } from '@/apis/mutations';

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    registerMutation.mutate(form, {
      onSuccess: () => {
        toast.success('Registration successful! Please login.');
        router.push('/login');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Registration failed');
      },
    });
  };

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: 'var(--accent-glow)' }}
      />
      <div
        className="pointer-events-none absolute right-1/3 bottom-1/4 h-[300px] w-[300px] rounded-full blur-[120px]"
        style={{ background: 'var(--accent-glow-2)' }}
      />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="logo-themed mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Join the IITB Library community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name *" type="text" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} icon={<User className="h-4 w-4" />} />
            <Input label="Email *" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} icon={<Mail className="h-4 w-4" />} />
            <Input label="Password *" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} icon={<Lock className="h-4 w-4" />} />
            <Input label="Phone *" type="tel" placeholder="01700000000" value={form.phone} onChange={(e) => update('phone', e.target.value)} icon={<Phone className="h-4 w-4" />} />
            <Input label="Address" type="text" placeholder="Dhaka, Bangladesh" value={form.address} onChange={(e) => update('address', e.target.value)} icon={<MapPin className="h-4 w-4" />} />

            <Button type="submit" className="w-full" size="lg" isLoading={registerMutation.isPending}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
