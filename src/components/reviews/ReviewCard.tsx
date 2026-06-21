'use client';

import StarRating from '@/components/ui/StarRating';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = getTimeAgo(review.createdAt);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {review.user?.profileImage ? (
          <img
            src={review.user.profileImage}
            alt={review.user.name || 'User'}
            className="h-9 w-9 rounded-full object-cover border border-white/10 flex-shrink-0"
          />
        ) : (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-sm font-bold text-white flex-shrink-0">
            {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-white truncate">
              {review.user?.name || 'Anonymous'}
            </span>
            <span className="flex-shrink-0 text-xs text-slate-600">
              {timeAgo}
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" />
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
