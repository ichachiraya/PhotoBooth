import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

/**
 * A small icon-only control. Always takes an explicit `label` used as
 * aria-label, since an icon alone is never an accessible name.
 */
export function IconButton({ icon, label, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line text-text transition-opacity duration-150 ease-out hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
