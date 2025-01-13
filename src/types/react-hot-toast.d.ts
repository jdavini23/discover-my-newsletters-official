import React from 'react';
declare module 'react-hot-toast' {
    export interface Toast {
        id: string;
        type?: 'success' | 'error' | 'loading' | 'blank';
        message: string;
        icon?: React.ReactNode;
        duration?: number;
    }
    export function toast(message: string, options?: Partial<Toast>): string { return undefined; }
    export namespace toast {
        function success(message: string, options?: Partial<Toast>): string { return undefined; }
        function error(message: string, options?: Partial<Toast>): string { return undefined; }
        function loading(message: string, options?: Partial<Toast>): string { return undefined; }
        function blank(message: string, options?: Partial<Toast>): string { return undefined; }
        export function info(message: string) {
            throw new Error('Function not implemented.');
        }
    }
}
import type { GlobalTypes } from '@/type/s/global';/
import { Toast } from 'react-hot-toast';
<>/Toast>;/

export default react-hot-toast.d

export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast

export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;
export type Toast = Toast

export type Toast = Toast;


