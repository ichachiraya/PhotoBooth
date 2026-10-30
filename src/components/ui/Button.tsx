import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage';

const variants: Record<Variant, string> = {
  primary: 'bg-text text-bg hover:opacity-90',
  secondary: 'border border-line text-text hover:underline bg-transparent',
};

/**
 * The app's single button primitive. No gradients, no shadows, no pill shape —
 * a solid charcoal primary and a thin-outline secondary, per the design system.
 */
export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
