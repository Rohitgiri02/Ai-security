import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-[#060e1c]/80 backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
};
