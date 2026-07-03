'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');
  const type = searchParams.get('type');
  const isBook = type === 'book';

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="p-8 text-center">
        {/* Success Animation */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 animate-fade-in-up">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white animate-fade-in-up">
          {isBook ? 'Purchase Successful! 🎉' : 'Payment Successful! 🎉'}
        </h1>
        <p className="mb-6 text-slate-400 animate-fade-in-up">
          {isBook 
            ? 'Your purchase has been completed successfully! Happy reading.' 
            : 'Your fine has been paid successfully. Thank you for clearing your dues.'}
        </p>

        {tranId && (
          <div className="mb-6 rounded-xl bg-white/5 p-4 animate-fade-in-up">
            <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-slate-300 break-all">{tranId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 animate-fade-in-up">
          <Link href={isBook ? '/payments' : '/my-dashboard'}>
            <Button className="w-full" icon={<BookOpen className="h-4 w-4" />}>
              {isBook ? 'View My Purchases' : 'Go to My Space'}
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16">
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 h-20 w-20 animate-pulse rounded-full bg-emerald-500/10" />
            <div className="mx-auto h-6 w-48 animate-pulse rounded bg-white/10" />
          </Card>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
