'use client';

import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  asLink?: boolean;
  href?: string;
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  href: string;
}

const baseStyles = 'btn-base uppercase-tight font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-accent-neon-magenta hover:bg-accent-neon-magenta/90 text-bg-dark hover:shadow-neon-magenta',
  success: 'bg-status-success hover:bg-status-success/90 text-bg-dark hover:shadow-glow-lime',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-9 gap-1',
  md: 'px-6 py-2.5 text-sm min-h-11 gap-2',
  lg: 'px-8 py-3.5 text-base min-h-12 gap-3',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonClass}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', href, ...props }, ref) => {
    const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} inline-flex`;

    return (
      <Link ref={ref} href={href} className={buttonClass} {...props}>
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';

// Export as default for convenience
export default Button;
