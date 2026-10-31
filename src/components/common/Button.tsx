import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-md bg-surface-raised px-3 py-1.5 text-sm text-gray-100 hover:bg-accent hover:text-black transition-colors ${className}`}
      {...props}
    />
  );
}
