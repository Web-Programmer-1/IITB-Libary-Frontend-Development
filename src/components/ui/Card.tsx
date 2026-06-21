import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card-themed rounded-2xl transition-all duration-300 ${
        hover
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
