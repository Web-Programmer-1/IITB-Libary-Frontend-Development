'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCategories } from '@/apis/queries';
import type { BookQueryParams } from '@/types';

interface BookFiltersProps {
  filters: BookQueryParams;
  onChange: (filters: BookQueryParams) => void;
}

export default function BookFilters({ filters, onChange }: BookFiltersProps) {
  const { data: categories } = useCategories({ limit: 50 });

  const updateFilter = (key: keyof BookQueryParams, value: any) => {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: 10 });
  };

  const hasActiveFilters =
    filters.search || filters.categoryId || filters.minRating || filters.sortBy;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <SlidersHorizontal className="h-4 w-4" />
          Filters:
        </div>

        {/* Category */}
        <select
          value={filters.categoryId || ''}
          onChange={(e) => updateFilter('categoryId', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl transition-all focus:border-blue-500/50 focus:outline-none [&>option]:bg-slate-900"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Rating */}
        <select
          value={filters.minRating || ''}
          onChange={(e) => updateFilter('minRating', e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl transition-all focus:border-blue-500/50 focus:outline-none [&>option]:bg-slate-900"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
          <option value="2">2 Stars & Up</option>
          <option value="1">1 Star & Up</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy || ''}
          onChange={(e) =>
            updateFilter('sortBy', e.target.value)
          }
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl transition-all focus:border-blue-500/50 focus:outline-none [&>option]:bg-slate-900"
        >
          <option value="">Latest First</option>
          <option value="title_asc">Title A-Z</option>
          <option value="year_desc">Newest Year</option>
          <option value="rating_desc">Top Rated</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-all hover:bg-red-500/20"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
