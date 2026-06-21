import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      icon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const variantClass =
      variant === 'primary'
        ? 'btn-themed active:scale-[0.98]'
        : variant === 'secondary'
          ? 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] active:scale-[0.98]'
          : variant === 'ghost'
            ? 'text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
            : variant === 'danger'
              ? 'bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20 active:scale-[0.98]'
              : 'border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:border-[var(--card-border-hover)] hover:text-[var(--text-primary)]';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
