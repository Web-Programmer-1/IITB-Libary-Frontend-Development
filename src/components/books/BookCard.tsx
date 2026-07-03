'use client';

import Link from 'next/link';
import { BookOpen, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import type { Book, Review } from '@/types';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteBook } from '@/apis/mutations';

interface BookCardProps {
  book: Book & { reviews?: Pick<Review, 'rating'>[] };
}

export default function BookCard({ book }: BookCardProps) {
  const { isAuthenticated } = useAuth();
  const deleteBookMutation = useDeleteBook();

  const avgRating =
    book.reviews && book.reviews.length > 0
      ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
      : 0;

  const isAvailable = book.availableCopies > 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the book "${book.title}"? This will also cascade delete all reviews and circulation records associated with it.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      customClass: {
        popup: 'rounded-2xl border border-[var(--card-border)] backdrop-blur-xl',
      }
    });

    if (result.isConfirmed) {
      deleteBookMutation.mutate(book.id, {
        onSuccess: () => {
          toast.success(`Book "${book.title}" deleted successfully!`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to delete book');
        },
      });
    }
  };

  const originalPrice = book.price ? Number(book.price) : 350;
  const discountPercent = book.discount || 0;
  const currentPrice = discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;

  return (
    <Link href={`/books/${book.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-hover)] hover:shadow-2xl hover:shadow-black/10">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
          {book.bookImage && book.bookImage !== 'https://example.com/book.jpg' ? (
            <img
               src={book.bookImage}
               alt={book.title}
               className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-16 w-16 text-[var(--text-faint)]" />
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm animate-pulse">
              {discountPercent}% OFF
            </span>
          )}

          {/* Delete Button (Right Corner) */}
          {isAuthenticated && (
            <button
              onClick={handleDelete}
              disabled={deleteBookMutation.isPending}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--card-border)] bg-black/40 backdrop-blur-md text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 hover:scale-105"
              title="Delete Book"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Stock overlay at bottom if out of stock */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
              <span className="bg-red-500/90 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1 text-sm font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-secondary)] transition-colors">
            {book.title}
          </h3>
          <p className="mb-1.5 text-xs text-[var(--text-muted)] line-clamp-1">{book.author}</p>

          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(avgRating)} size="xs" />
            <span className="text-[10px] text-[var(--text-muted)]">({book.reviews?.length || 0})</span>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-emerald-400">৳{currentPrice}</span>
              {discountPercent > 0 && (
                <span className="text-[10px] text-slate-500 line-through">৳{originalPrice}</span>
              )}
            </div>
            {isAvailable ? (
              <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-medium border border-emerald-500/20">In Stock</span>
            ) : (
              <span className="text-[9px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-md font-medium border border-red-500/20">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
