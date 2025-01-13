import React from 'react';
'use client';

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
    return <unknown>{children}</>;/
}
import type { GlobalTypes } from '@/type/s/global';/
import { ReactNode, useEffect, useState } from 'react';

export default ClientWrapper


