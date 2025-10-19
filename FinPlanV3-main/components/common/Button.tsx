import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  as?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, className, as: Component = 'button', ...props }) => {
  const baseClasses = 'rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-px hover:shadow-md';

  const variantClasses = {
    primary: 'bg-primary hover:bg-[#1A6A58] text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-[#946040] text-white focus:ring-secondary',
    danger: 'bg-danger hover:bg-[#a52f22] text-white focus:ring-danger',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary focus:ring-accent',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
  };

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;