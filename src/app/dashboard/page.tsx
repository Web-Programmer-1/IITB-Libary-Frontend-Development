'use client';

import {
  BookOpen,
  Users,
  RefreshCw,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { useSharedDashboard } from '@/apis/queries';

export default function DashboardPage() {
  const { data, isLoading } = useSharedDashboard();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Library overview and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Books"
              value={data?.totalBooks ?? 0}
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatCard
              title="Total Users"
              value={data?.totalUsers ?? 0}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              title="Active Issues"
              value={data?.activeIssues ?? 0}
              icon={<RefreshCw className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Fines"
              value={`৳${data?.totalPendingFines ?? 0}`}
              icon={<DollarSign className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* Low Stock Alert */}
      {data?.lowStockBooks && data.lowStockBooks.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Low Stock Alert
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.lowStockBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {book.availableCopies}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            book.availableCopies === 0 ? 'danger' : 'warning'
                          }
                        >
                          {book.availableCopies === 0
                            ? 'Out of Stock'
                            : 'Low Stock'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
