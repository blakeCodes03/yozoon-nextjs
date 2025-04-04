// src/components/ui/Button.tsx

import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'cta-button' : 'regular-button';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const className = `${baseClasses} ${variantClasses} ${disabledClasses}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
