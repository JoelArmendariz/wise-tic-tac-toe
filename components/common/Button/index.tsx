import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import LoadingSpinner from '../LoadingSpinner';

export type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary hover:scale-[103%] hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-secondary text-black hover:scale-[103%] hover:bg-secondary-hover active:bg-secondary-active',
};

export default function Button({
  variant = 'primary',
  children,
  className,
  isLoading,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'relative px-4 py-2 rounded-xl shadow transition-all',
        VARIANT_CLASSES[variant],
        isLoading ? 'text-transparent' : '',
        className
      )}
      {...props}
    >
      {children}
      {isLoading ? (
        <div className="absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2">
          <LoadingSpinner size="sm" />
        </div>
      ) : null}
    </button>
  );
}
