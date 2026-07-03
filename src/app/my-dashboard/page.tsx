'use client';

import {
  BookOpen,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import StarRating from '@/components/ui/StarRating';
import { useMyDashboard, usePaymentHistory } from '@/apis/queries';
import { useInitiatePayment, useReturnBook } from '@/apis/mutations';
import { getEstimatedFine, getOverdueDays, OVERDUE_FINE_PER_DAY } from '@/lib/fines';
import type { Payment } from '@/types';

export default function MyDashboardPage() {
  const { data, isLoading } = useMyDashboard();
  const { data: paymentHistory, isLoading: isLoadingPayments } = usePaymentHistory();
  const returnMutation = useReturnBook();
  const initiatePaymentMutation = useInitiatePayment();

  const handleReturn = (issueId: string) => {
    returnMutation.mutate(issueId, {
      onSuccess: () => toast.success('Book returned successfully!'),
      onError: (error: any) =>
        toast.error(error?.response?.data?.message || 'Return failed'),
    });
  };

  const handlePayFine = (fineId: string) => {
    initiatePaymentMutation.mutate(fineId, {
      onSuccess: (response) => {
        toast.success('Redirecting to payment gateway...');
        // Redirect to SSLCommerz payment page
        window.location.href = response.paymentUrl;
      },
      onError: (error: any) =>
        toast.error(error?.response?.data?.message || 'Payment initiation failed'),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const profile = data?.profile;
  const activeIssues = data?.activeIssues ?? [];
  const myReviews = data?.myReviews ?? [];
  const myFines = data?.myFines ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">My Space</h1>
        <p className="mt-2 text-slate-500">
          Your personal library dashboard
        </p>
      </div>

      {/* Profile card */}
      {profile && (
        <Card className="mb-8 p-6 animate-fade-in-up">
          <div className="flex items-center gap-4">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="h-14 w-14 rounded-2xl object-cover border border-[var(--card-border)] bg-[var(--bg-secondary)] flex-shrink-0"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white flex-shrink-0">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-white">
                {profile.name}
              </h2>
              <p className="text-sm text-slate-400">{profile.email}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(profile.joinDate).toLocaleDateString()}
                </span>
                {Number(profile.fineBalance) > 0 && (
                  <Badge variant="danger">
                    ৳{String(profile.fineBalance)} fine
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3 stagger-children">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {activeIssues.length}
              </p>
              <p className="text-xs text-slate-500">Active Issues</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {myReviews.length}
              </p>
              <p className="text-xs text-slate-500">Reviews Written</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {myFines.length}
              </p>
              <p className="text-xs text-slate-500">Pending Fines</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Issues */}
      <div className="mb-8 animate-fade-in-up">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Clock className="h-5 w-5 text-blue-400" />
          Currently Issued Books
        </h2>

        {activeIssues.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">
              No books currently issued.{' '}
              <Link href="/books" className="text-blue-400 hover:underline">
                Browse books
              </Link>
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeIssues.map((issue) => {
              const isOverdue = new Date(issue.dueDate) < new Date();
              const overdueDays = isOverdue ? getOverdueDays(issue.dueDate) : 0;
              const estimatedFine = isOverdue ? getEstimatedFine(issue.dueDate) : 0;
              const recordedFine = Number(issue.fineAmount) || 0;
              const displayFine = Math.max(recordedFine, estimatedFine);

              return (
                <Card key={issue.id} className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
                        <BookOpen className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {issue.book?.title ?? 'Unknown Book'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>
                            Due:{' '}
                            {new Date(issue.dueDate).toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <Badge variant="danger">Overdue</Badge>
                          )}
                        </div>
                        {displayFine > 0 && (
                          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/10 p-2.5 w-fit">
                            <div className="flex flex-col px-2 text-center border-r border-white/10 pr-3">
                              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Late Days</span>
                              <span className="text-sm font-semibold text-white mt-0.5">{overdueDays} day(s)</span>
                            </div>
                            <span className="text-slate-500 text-xs px-1">×</span>
                            <div className="flex flex-col px-2 text-center border-r border-white/10 pr-3">
                              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rate</span>
                              <span className="text-sm font-semibold text-white mt-0.5">৳{OVERDUE_FINE_PER_DAY}/day</span>
                            </div>
                            <span className="text-slate-500 text-xs px-1">=</span>
                            <div className="flex flex-col px-2 text-center">
                              <span className="text-red-400 text-[10px] uppercase font-bold tracking-wider">Total Fine</span>
                              <span className="text-sm font-bold text-red-400 mt-0.5">৳{displayFine}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReturn(issue.id)}
                      isLoading={returnMutation.isPending}
                    >
                      Return Book
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* My Reviews */}
      <div className="mb-8 animate-fade-in-up">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Star className="h-5 w-5 text-amber-400" />
          My Reviews
        </h2>

        {myReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">You haven&apos;t reviewed any books yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {myReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {(review.book as { title: string })?.title}
                    </p>
                    <StarRating rating={review.rating} size="sm" />
                    <p className="mt-1 text-sm text-slate-400">
                      {review.comment}
                    </p>
                  </div>
                  <span className="text-xs text-slate-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Fines */}
      {myFines.length > 0 && (
        <div className="mb-8 animate-fade-in-up">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Pending Fines
          </h2>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="space-y-2">
              {myFines.map((fine) => (
                <div
                  key={fine.id}
                  className="flex flex-col gap-3 rounded-xl bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {fine.issueReturn?.book?.title ?? `Fine #${fine.id.slice(0, 8)}`}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Fine #{fine.id.slice(0, 8)}</span>
                      {fine.issueReturn?.dueDate && (
                        <span>
                          Due {new Date(fine.issueReturn.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge variant="danger">৳{String(fine.amount)}</Badge>
                    <Button
                      size="sm"
                      onClick={() => handlePayFine(fine.id)}
                      isLoading={initiatePaymentMutation.isPending}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <PaymentHistorySection
        payments={paymentHistory ?? []}
        isLoading={isLoadingPayments}
      />
    </div>
  );
}

function PaymentHistorySection({
  payments,
  isLoading,
}: {
  payments: Payment[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="animate-fade-in-up">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (payments.length === 0) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return { variant: 'success' as const, label: 'Paid ✅', color: 'text-emerald-400' };
      case 'FAILED':
        return { variant: 'danger' as const, label: 'Failed ❌', color: 'text-red-400' };
      case 'CANCELLED':
        return { variant: 'warning' as const, label: 'Cancelled', color: 'text-amber-400' };
      default:
        return { variant: 'warning' as const, label: 'Pending ⏳', color: 'text-amber-400' };
    }
  };

  const renderPaymentMethod = (cardType: string | null) => {
    if (!cardType) return <span className="text-slate-500">—</span>;

    const typeLower = cardType.toLowerCase();

    if (typeLower.includes('bkash')) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-10 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-sm">
            <img
              src="https://download.logo.wine/logo/BKash/BKash-Logo.wine.png"
              alt="bKash"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300">bKash</span>
        </div>
      );
    }

    if (typeLower.includes('nagad')) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-10 shrink-0 items-center justify-center rounded bg-white p-0.5 shadow-sm">
            <img
              src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png"
              alt="Nagad"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300">Nagad</span>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center rounded bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-300 border border-white/10">
        {cardType}
      </span>
    );
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <DollarSign className="h-5 w-5 text-emerald-400" />
        Payment History
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Book
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                return (
                  <tr
                    key={payment.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900/80">
                          {payment.fine?.issueReturn?.book?.bookImage &&
                          payment.fine.issueReturn.book.bookImage !== 'https://example.com/book.jpg' ? (
                            <img
                              src={payment.fine.issueReturn.book.bookImage}
                              alt={payment.fine.issueReturn.book.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <BookOpen className="h-3 w-3 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {payment.fine?.issueReturn?.book?.title ?? 'Unknown Book'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {payment.fine?.issueReturn?.book?.author ?? ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-white">
                        ৳{String(payment.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {renderPaymentMethod(payment.card_type)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-600">
                        {payment.tran_id.slice(0, 20)}…
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
