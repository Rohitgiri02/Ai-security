import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-400/40',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-500/30',
  outline: 'bg-transparent hover:bg-white/10 text-slate-100 border border-white/20',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/40',
};

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
