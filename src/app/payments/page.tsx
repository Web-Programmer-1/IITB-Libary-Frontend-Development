'use client';

import { usePaymentHistory } from '@/apis/queries';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { CreditCard, Calendar, BookOpen, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsPage() {
  const { data: payments, isLoading, error } = usePaymentHistory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Success</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Failed</Badge>;
      case 'CANCELLED':
        return <Badge variant="warning">Cancelled</Badge>;
      default:
        return <Badge variant="info">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
        <h1 className="mb-6 text-2xl font-bold text-white">Payment History</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">Failed to Load Payments</h2>
        <p className="text-slate-400">Please try refreshing the page later.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            Payment History
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            View details of all your book purchases and fine payments
          </p>
        </div>
      </div>

      {!payments || payments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-white/5 p-4">
            <ShoppingBag className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-lg font-medium text-slate-300">No payment logs found</p>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            You haven't initiated any payments or purchased any books yet.
          </p>
          <Link
            href="/books"
            className="btn-themed px-5 py-2.5 rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]"
          >
            Browse Books
          </Link>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Item Type</th>
                  <th className="px-6 py-4">Title / Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {payments.map((payment) => {
                  const isBook = !!payment.bookId;
                  const itemTitle = isBook 
                    ? payment.book?.title 
                    : payment.fine?.issueReturn?.book?.title;
                  const itemImage = isBook 
                    ? payment.book?.bookImage 
                    : payment.fine?.issueReturn?.book?.bookImage;
                  const itemAuthor = isBook
                    ? payment.book?.author
                    : payment.fine?.issueReturn?.book?.author;

                  return (
                    <tr 
                      key={payment.id} 
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-400 select-all max-w-[150px] truncate" title={payment.tran_id}>
                          {payment.tran_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isBook ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            Book Purchase
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20">
                            Library Fine
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {itemTitle ? (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-slate-800 border border-white/10">
                              {itemImage && itemImage !== 'https://example.com/book.jpg' ? (
                                <img
                                  src={itemImage}
                                  alt={itemTitle}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div className="truncate max-w-[200px]">
                              <div className="font-medium text-white truncate" title={itemTitle}>
                                {isBook ? (
                                  <Link href={`/books/${payment.bookId}`} className="hover:underline">
                                    {itemTitle}
                                  </Link>
                                ) : (
                                  <span>{itemTitle}</span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{itemAuthor || 'N/A'}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">
                            {isBook ? 'Book Details Unavailable' : 'Fine Details Unavailable'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ৳{Number(payment.amount)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {formatDate(payment.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
