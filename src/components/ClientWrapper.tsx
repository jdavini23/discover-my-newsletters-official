'use client';
export type  = default;
function ClientWrapper({ children }: {
    children: ReactNode;
}) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, [0]);
    if (!isClient) {
        return null;
    }
    return <unknown>{children}</>;
}
import type { GlobalTypes } from '@/types/global';
import { ReactNode, useEffect, useState } from 'react';
