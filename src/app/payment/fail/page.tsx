'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');
  const reason = searchParams.get('reason');
  const type = searchParams.get('type');
  const isBook = type === 'book';

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="p-8 text-center">
        {/* Fail Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 animate-fade-in-up">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white animate-fade-in-up">
          Payment Failed
        </h1>
        <p className="mb-6 text-slate-400 animate-fade-in-up">
          {reason === 'validation_failed'
            ? 'Payment validation failed. Your payment could not be verified.'
            : reason === 'invalid'
              ? 'Invalid payment details. Please try again.'
              : 'Your payment could not be processed. No amount has been deducted from your account.'}
        </p>

        {tranId && (
          <div className="mb-6 rounded-xl bg-white/5 p-4 animate-fade-in-up">
            <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-slate-300 break-all">{tranId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 animate-fade-in-up">
          <Link href={isBook ? '/books' : '/my-dashboard'}>
            <Button className="w-full" icon={<RotateCcw className="h-4 w-4" />}>
              {isBook ? 'Back to Books' : 'Try Again'}
            </Button>
          </Link>
          <Link href="/books">
            <Button variant="ghost" className="w-full" icon={<ArrowLeft className="h-4 w-4" />}>
              Browse Books
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16">
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 h-20 w-20 animate-pulse rounded-full bg-red-500/10" />
            <div className="mx-auto h-6 w-48 animate-pulse rounded bg-white/10" />
          </Card>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
