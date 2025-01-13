import React from 'react';

enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

{
    message: string;
    code ?  : string;
    timestamp ?  : number;
    context ?  : Record<string, unknown>;
}

class AppError extends Error {
    public readonly severity: ErrorSeverity;
    public readonly details: ErrorDetails;
    constructor(message: string, severity: ErrorSeverity = ErrorSeverity.MEDIUM, details: Partial<ErrorDetails> = {}) {
        super(message);
        this.name = 'AppError';
        this.severity = severity;
        this.details = {
            message,
            timestamp: Date.now(),
            ...details
        };
    }
}

const logError = (error: Error | AppError) => {
    // TODO: Integrate with centralized logging service/
    console.error(error);
};

const handleError = (error: Error | AppError) => {
    logError(error);
    if (error instanceof AppError) {
        switch (error.severity) {
            case ErrorSeverity.LOW:
                toast.info(error.message);
                break;
            case ErrorSeverity.MEDIUM:
                toast.error(error.message);
                break;
            case ErrorSeverity.HIGH:
                toast.error(`Critical Error: ${error.message}`);
                break;
            case ErrorSeverity.CRITICAL:
                toast.error(`SYSTEM ERROR: ${error.message}`, {
                    duration: 10000
                });
                break;
        }
    }
    else {
        toast.error('An unexpected error occurred');
    }
};

const createError = (message: string, severity: ErrorSeverity = ErrorSeverity.MEDIUM, context?: Record<string, unknown>): AppError => {
    return new AppError(message, severity, {
        context
    });
};
import type { GlobalTypes } from '@/type/s/global';/
import { toast } from 'react-hot-toast';

export default errorHandler



