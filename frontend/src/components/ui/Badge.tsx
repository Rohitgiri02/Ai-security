import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge: React.FC<BadgeProps> = ({ className, ...props }) => {
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border', className)}
      {...props}
    />
  );
};
