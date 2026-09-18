import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'onDark';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2 text-base font-semibold leading-tight no-underline motion-safe:transition-colors disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-amber text-white hover:bg-deep',
  secondary: 'border-2 border-deep bg-white text-deep hover:bg-tint',
  quiet: 'px-3 text-deep underline decoration-2 underline-offset-4 hover:bg-tint',
  onDark: 'bg-sand text-deep hover:bg-white',
};

export const buttonClass = (variant: ButtonVariant = 'primary', extra = '') =>
  `${base} ${variants[variant]} ${extra}`.trim();

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({ variant = 'primary', className = '', ...props }: LinkProps & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
