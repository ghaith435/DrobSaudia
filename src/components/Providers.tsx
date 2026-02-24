'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { CityProvider } from '@/context/CityContext';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <CityProvider>
                {children}
            </CityProvider>
        </SessionProvider>
    );
}
