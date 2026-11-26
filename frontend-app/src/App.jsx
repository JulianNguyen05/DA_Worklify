import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Thông báo nổi toàn cục: import { toast } from 'react-hot-toast' rồi gọi toast.success(...) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#0f172a',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 16px 40px -12px rgb(15 23 42 / 0.25)',
          },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e11d48', secondary: '#fff' } },
        }}
      />
    </>
  );
}
