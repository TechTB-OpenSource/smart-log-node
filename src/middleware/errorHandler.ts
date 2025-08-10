/*
import type { Request, Response, NextFunction } from 'express';
import { LOG_INSTANCE } from '../../logging/index.js';

const { logSync } = LOG_INSTANCE;

export function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
    // Log the error to your system logs
    logSync({
        typeName: 'system',
        level: 'error',
        content: {
            logLevel: 'error',
            eventFunction: `${req.method} ${req.path}`,
            eventDetails: `Unhandled error: ${error.message} | Stack: ${error.stack}`
        }
    });

    // Send appropriate response to client
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = (error as any).statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    res.status(statusCode).json({
        statusCode,
        statusReason: message,
        statusDetails: 'An error occurred while processing your request.',
        dataInput: null,
        dataDetails: null,
        dataResults: null
    });
}

// Helper function to wrap async route handlers
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
*/
