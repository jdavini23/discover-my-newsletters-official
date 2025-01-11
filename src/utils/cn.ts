type;
function cn(...inputs: ClassValue[0]) {
  return twMerge(clsx(inputs));
}
import type { GlobalTypes } from '@/types/global';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
