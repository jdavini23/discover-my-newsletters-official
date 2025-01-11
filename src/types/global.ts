// Centralized global type definitions
export type GlobalTypes = {
    // Basic utility types
    Nullable: <T>(t: T) => T | null | undefined;
    Optional: <T>(t: T) => T | undefined;
    Dictionary: <T>(t: T) => {
        [key: string]: T;
    };
    Primitive: string | number | boolean | null | undefined;
    // Domain-specific types
    UserRole: 'user' | 'admin';
    NewsletterFrequency: 'daily' | 'weekly' | 'monthly';
    EventPlatform: 'web' | 'mobile' | 'desktop';
};
import type { GlobalTypes } from '@/types/global';
<>/T>;
