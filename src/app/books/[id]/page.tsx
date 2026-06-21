'use client';

import { use } from 'react';
import {
  BookOpen,
  Calendar,
  Hash,
  Layers,
  MapPin,
  FileText,
  Globe,
  Building,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useBookDetail, useBookReviews } from '@/apis/queries';
import { useAuth } from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import Skeleton from '@/components/ui/Skeleton';

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: book, isLoading } = useBookDetail(id);
  const { data: reviews, isLoading: reviewsLoading } = useBookReviews(id);
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white">Book not found</p>
          <Link href="/books" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
            ← Back to books
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    book.reviews && book.reviews.length > 0
      ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
      : 0;

  const isAvailable = book.availableCopies > 0;

  const details = [
    { icon: Hash, label: 'ISBN', value: book.isbn },
    { icon: Building, label: 'Publisher', value: book.publisher },
    { icon: Calendar, label: 'Published', value: String(book.publishedYear) },
    { icon: FileText, label: 'Pages', value: String(book.pages) },
    { icon: Globe, label: 'Language', value: book.language },
    { icon: MapPin, label: 'Shelf', value: book.shelfNo },
    { icon: Layers, label: 'Total Copies', value: String(book.totalCopies) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Books
      </Link>

      <div className="animate-fade-in-up grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
          {book.bookImage && book.bookImage !== 'https://example.com/book.jpg' ? (
            <img
              src={book.bookImage}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-20 w-20 text-slate-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant={isAvailable ? 'success' : 'danger'}>
              {isAvailable
                ? `${book.availableCopies} copies available`
                : 'Not available'}
            </Badge>
            {book.category && (
              <Badge variant="info">{book.category.name}</Badge>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold text-white">{book.title}</h1>
          <p className="mb-4 text-lg text-slate-400">by {book.author}</p>

          {/* Rating */}
          <div className="mb-6 flex items-center gap-3">
            <StarRating rating={Math.round(avgRating)} size="md" />
            <span className="text-sm text-slate-500">
              {avgRating.toFixed(1)} ({book.reviews?.length ?? 0} reviews)
            </span>
          </div>

          {/* Description */}
          <p className="mb-6 text-sm text-slate-400 leading-relaxed">
            {book.description}
          </p>

          {/* Details grid */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div
                key={d.label}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                  <d.icon className="h-3.5 w-3.5" />
                  {d.label}
                </div>
                <p className="text-sm font-medium text-white">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          Reviews ({reviews?.length ?? 0})
        </h2>

        {/* Review Form */}
        {isAuthenticated && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">
              Write a Review
            </h3>
            <ReviewForm bookId={id} />
          </div>
        )}

        {/* Review List */}
        {reviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-500">No reviews yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
