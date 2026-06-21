import Link from 'next/link';
import { Grid3X3, BookOpen, Trash2 } from 'lucide-react';
import type { Category } from '@/types';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteCategory } from '@/apis/mutations';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { isAuthenticated } = useAuth();
  const deleteCategoryMutation = useDeleteCategory();
  const bookCount = category.books?.length ?? 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the category "${category.name}"? This will also cascade delete all ${bookCount} book(s) in this category.`,
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
      deleteCategoryMutation.mutate(category.id, {
        onSuccess: () => {
          toast.success(`Category "${category.name}" deleted successfully!`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to delete category');
        },
      });
    }
  };

  return (
    <Link href={`/books?categoryId=${category.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-hover)] hover:shadow-xl hover:shadow-black/10">
        {/* Delete Button (Left Corner) */}
        {isAuthenticated && (
          <button
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
            className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--card-border)] bg-black/40 backdrop-blur-md text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 hover:scale-105"
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        {/* Image */}
        <div className="relative h-36 overflow-hidden bg-[var(--bg-secondary)]">
          {category.categoryImage &&
          category.categoryImage !== 'https://example.com/category.jpg' ? (
            <img
              src={category.categoryImage}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Grid3X3 className="h-12 w-12 text-[var(--text-faint)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors">
            {category.name}
          </h3>
          <p className="mb-3 text-xs text-[var(--text-muted)] line-clamp-2">
            {category.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <BookOpen className="h-3.5 w-3.5" />
            {bookCount} {bookCount === 1 ? 'book' : 'books'}
          </div>
        </div>
      </div>
    </Link>
  );
}
