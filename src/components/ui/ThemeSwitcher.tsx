'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '@/hooks/useTheme';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
        aria-label="Change theme"
        title="Change theme"
      >
        <Palette className="h-[18px] w-[18px]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--bg-primary)]/95 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl animate-slide-down z-50">
          <p className="mb-1 px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Theme
          </p>
          {THEMES.map((t) => {
            const isActive = theme === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTheme(t.key);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                }`}
              >
                {/* Color dot */}
                <span
                  className="flex h-4 w-4 flex-shrink-0 rounded-full"
                  style={{
                    background: t.previewColor,
                    boxShadow: isActive ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${t.previewColor}` : 'none',
                  }}
                />
                <span className="flex-1 text-left font-medium">
                  {t.label}
                </span>
                {isActive && (
                  <Check className="h-3.5 w-3.5 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
