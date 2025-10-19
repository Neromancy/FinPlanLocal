import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  const baseClasses = 'w-full px-3 py-2 bg-surface border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary';
  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  );
};

export default Select;