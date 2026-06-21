interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--card-bg)] ${className}`}
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
      <Skeleton className="mb-4 h-48 w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-3 h-4 w-1/2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
      <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
      <Skeleton className="mb-2 h-8 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
