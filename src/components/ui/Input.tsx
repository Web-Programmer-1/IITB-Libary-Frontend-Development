import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border bg-[var(--card-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-[var(--danger)]/50 focus:ring-[var(--danger)]/50'
                : 'border-[var(--card-border)] hover:border-[var(--card-border-hover)] focus:border-[var(--accent-primary)]/50'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
