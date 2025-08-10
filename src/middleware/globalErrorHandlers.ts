/*
import { LOG_INSTANCE } from '../../logging/index.js';
import { consoleLogError } from '../index.js';

const { logSync } = LOG_INSTANCE;

export function setupGlobalErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
        consoleLogError(`Uncaught Exception: ${error.message}`);
        
        logSync({
            typeName: 'system',
            level: 'error',
            content: {
                logLevel: 'error',
                eventFunction: 'uncaughtException',
                eventDetails: `Uncaught Exception: ${error.message} | Stack: ${error.stack}`
            }
        });

        // Give time for the log to be written before exiting
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        const errorMessage = reason instanceof Error ? reason.message : String(reason);
        const errorStack = reason instanceof Error ? reason.stack : 'No stack trace available';
        
        consoleLogError(`Unhandled Promise Rejection: ${errorMessage}`);
        
        logSync({
            typeName: 'system',
            level: 'error',
            content: {
                logLevel: 'error',
                eventFunction: 'unhandledRejection',
                eventDetails: `Unhandled Promise Rejection: ${errorMessage} | Stack: ${errorStack}`
            }
        });

        // Don't exit the process for unhandled rejections in production
        // but you might want to in development
        // process.exit(1);
    });

    // Handle warnings
    process.on('warning', (warning: Error) => {
        logSync({
            typeName: 'system',
            level: 'warn',
            content: {
                logLevel: 'warn',
                eventFunction: 'processWarning',
                eventDetails: `Process Warning: ${warning.name} - ${warning.message} | Stack: ${warning.stack}`
            }
        });
    });
}

*/