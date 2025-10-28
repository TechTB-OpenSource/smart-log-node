export interface Settings {
    consoleLoggingEnabled: boolean;
    consoleDateTimeEnabled: boolean;
    debugLogsEnabled: boolean;
}

export interface LogDefinition<T> {
    category: string;
    insertFunction: (input: LogCommonInput<T>) => Promise<void>;
}

export interface LogCommonInput<T> {
    level?: string;
    category?: string;
    title?: string;
    content: T;
}

export interface LogConsoleInput {
    level?: string;
    category?: string;
    message?: string;
}

export interface ConsoleLogDefinition {
    level: string;
    color?: string;
    prefix?: string;
    suffix?: string;
}

export interface ColorMap {
    [key: string]: string;
}
