import { Toast } from 'react-hot-toast';
declare module 'react-hot-toast' {
  export interface Toast {
    id: string;
    type?: 'success' | 'error' | 'loading' | 'blank';
    message: string;
    icon?: React.ReactNode;
    duration?: number;
  }
  export function toast(message: string, options?: Partial<Toast>): string;
  export namespace toast {
    function success(message: string, options?: Partial<Toast>): string;
    function error(message: string, options?: Partial<Toast>): string;
    function loading(message: string, options?: Partial<Toast>): string;
    function blank(message: string, options?: Partial<Toast>): string;
  }
}
