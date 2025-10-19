import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const baseClasses = 'w-full px-3 py-2 bg-surface border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-gray-400 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary dark:placeholder-gray-500';
  return <input className={`${baseClasses} ${className}`} {...props} />;
};

export default Input;