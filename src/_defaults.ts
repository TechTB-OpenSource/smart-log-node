import { ColorMap, ConsoleLogDefinition } from "./_models";

export const defaultLogLevels: string[] = [
    'info',
    'success',
    'warn',
    'error'
];

export const defaultConsoleColors: ColorMap = {
    reset: '[0m',
    bold: '[1m',
    red: '[31m',
    green: '[32m',
    yellow: '[33m',
    blue: '[34m',
    magenta: '[35m',
    cyan: '[36m',
    orange: '[38;5;208m'
};

export const defaultConsoleDefinitions: ConsoleLogDefinition[] = [
    {
        level: "info",
        color: 'blue'
    },
    {
        level: "success",
        color: 'green'
    },
    {
        level: "warn",
        color: 'yellow'
    },
    {
        level: "error",
        color: 'red'
    }
]
