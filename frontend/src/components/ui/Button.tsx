import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghostDanger' | 'pagination';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-500 disabled:bg-slate-600',
  outline:
    'border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800',
  ghostDanger: 'px-0 py-0 text-sm text-red-300 hover:text-red-200',
  pagination:
    'border border-slate-700 px-2 py-1 text-xs text-slate-100 disabled:opacity-50',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth,
  className,
  ...props
}) => {
  const classes = [
    baseClasses,
    variantClasses[variant],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
};

