import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        
        {/* Header Layout */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              SmartMatch
            </h1>
          </Link>
          {title && (
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {title}
            </h2>
          )}
        </div>

        {/* Nội dung Form (Render từ children) */}
        <div className="mt-4">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;