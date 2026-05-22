import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Kéo hệ thống Router chúng ta đã làm vào đây

export default function App() {
    return (
        // RouterProvider sẽ thay thế chữ "SmartMatch Frontend" bằng các trang thực tế
        <RouterProvider router={router} />
    );
}