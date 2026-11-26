import { Loader2 } from 'lucide-react';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'border-2 border-brand text-brand hover:bg-brand-soft',
  ghost: 'text-ink hover:bg-black/5',
};

/** Classes réutilisables pour un <Link> qui doit ressembler à un bouton. */
export function buttonClasses(variant = 'primary', extra = '') {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={buttonClasses(variant, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
