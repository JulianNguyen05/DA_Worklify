import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Gộp className có điều kiện và loại bỏ class Tailwind xung đột (class truyền sau thắng).
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
