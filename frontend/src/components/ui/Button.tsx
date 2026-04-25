import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default:   'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/25 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.12)]',
  secondary: 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20',
  outline:   'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-white/15 hover:border-white/30',
  danger:    'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-400/20 hover:border-rose-400/40',
  ghost:     'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-transparent',
};

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
