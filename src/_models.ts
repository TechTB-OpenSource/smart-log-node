export type LogLevels = string[];

export interface SmartLogSettings {
    consoleLoggingEnabled: boolean;
    consoleDateTimeEnabled: boolean;
    debugLogsEnabled: boolean;
}

export interface SmartLogDefinition<T extends object> {
    category: string;
    insertFunction: (input: SmartLogInput<T>) => Promise<void>;
}

export interface SmartLogInput<T extends object> {
    level?: string;
    category?: string;
    content: T;
    displayedContentKeys?: string[];
}

export interface ConsoleLogInput {
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
