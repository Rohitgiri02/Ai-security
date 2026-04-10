import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('rounded-xl border border-white/15 bg-[#081322cc] backdrop-blur-md', className)}
      {...props}
    />
  );
};
