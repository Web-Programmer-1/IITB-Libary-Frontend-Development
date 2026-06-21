'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { useCreateReview } from '@/apis/mutations';

interface ReviewFormProps {
  bookId: string;
}

export default function ReviewForm({ bookId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const mutation = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    mutation.mutate(
      { bookId, rating, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted!');
          setRating(0);
          setComment('');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || 'Failed to submit review',
          );
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Your Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your thoughts about this book..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>

      <Button
        type="submit"
        isLoading={mutation.isPending}
        icon={<Send className="h-4 w-4" />}
      >
        Submit Review
      </Button>
    </form>
  );
}
