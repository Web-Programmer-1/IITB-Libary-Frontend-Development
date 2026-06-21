import { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden card-themed rounded-2xl p-6">
      {/* Gradient glow behind the icon — uses theme accent */}
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: `var(--accent-primary)` }}
      />

      <div className="relative">
        <div className="logo-themed mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg">
          {icon}
        </div>

        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{title}</p>

        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs text-[var(--success)]">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
