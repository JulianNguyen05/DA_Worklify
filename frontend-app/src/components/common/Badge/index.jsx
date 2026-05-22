import React from 'react';

export default function Badge({ children, variant = 'primary' }) {
  const colors = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[variant] || colors.primary}`}>
      {children}
    </span>
  );
}