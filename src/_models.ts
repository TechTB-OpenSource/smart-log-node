export type LogLevels = string[];

export interface SmartLogSettings {
    debugLogsEnabled: boolean;
    consoleLoggingEnabled: boolean;
    consoleDateTimeEnabled: boolean;
    consoleLevelLength: number;
    consoleNameLength: number;
}

export interface SmartLogSettingsInput {
    debugLogsEnabled?: boolean;
    consoleLoggingEnabled?: boolean;
    consoleDateTimeEnabled?: boolean;
    consoleLevelLength?: number;
    consoleNameLength?: number;
}

export interface SmartLogDefinition<T extends object> {
    definitionName: string;
    insertFunction: (input: SmartLogInput<T>) => Promise<void>;
}

export interface SmartLogInput<T extends object> {
    definitionName: string;
    level?: string;
    consoleEnabled?: boolean;
    consoleDateTimeEnabled?: boolean;
    consoleName?: string;
    content: T;
    displayedContentKeys?: string[];
}

export interface ConsoleLogInput {
    level?: string;
    name?: string;
    dateTimeEnabled?: boolean;
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
