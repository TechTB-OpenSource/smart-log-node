import type { SmartLogSettings, SmartLogDefinition, SmartLogInput, ConsoleLogInput, ColorMap, ConsoleLogDefinition } from './_models.js';
import {
    defaultSettings,
    defaultConsoleColors,
    defaultConsoleLogDefinitions,
    defaultLogLevels,
    defaultLogLevelDebugName
} from './_defaults.js';
import _utils from './_utils.js';

const { convertToString, formatDateTimeForConsole } = _utils;

function createSmartLogInstance() {
    const definitions: SmartLogDefinition<any>[] = [];
    const consoleLogDefinitions: ConsoleLogDefinition[] = defaultConsoleLogDefinitions;
    const logLevels: string[] = defaultLogLevels;
    let logLevelDebugName: string = defaultLogLevelDebugName;
    const consoleColors: ColorMap = defaultConsoleColors;
    const settings: SmartLogSettings = defaultSettings;

    function setSettings(newSettings: SmartLogSettings): void {
        settings.consoleLoggingEnabled = newSettings.consoleLoggingEnabled;
        settings.consoleDateTimeEnabled = newSettings.consoleDateTimeEnabled;
        settings.debugLogsEnabled = newSettings.debugLogsEnabled;
    }

    function setLogLevels(levels: string[]): void {
        for (let i = 0; i < levels.length; i++) {
            const level = levels[i];
            if (!level || typeof level !== 'string' || level.trim() === '') {
                console.error(`${defaultConsoleColors.red}Smart Log Error: Invalid log level provided: ${level}${defaultConsoleColors.reset}`);
                return;
            }
            if (level.length > 32) {
                console.error(`${defaultConsoleColors.red}Smart Log Error: Log level exceeds maximum length of 32 characters: ${level}${defaultConsoleColors.reset}`);
                return;
            }
        }
        logLevels.length = 0;
        logLevels.push(...levels);
    }

    function setLogLevelDebug(level: string): void {
        if (!level || typeof level !== 'string' || level.trim() === '') {
            console.error(`${defaultConsoleColors.red}Smart Log Error: Invalid debug level provided.${defaultConsoleColors.reset}`);
            return;
        }
        if (level.length > 32) {
            console.error(`${defaultConsoleColors.red}Smart Log Error: Debug level exceeds maximum length of 32 characters.${defaultConsoleColors.reset}`);
            return;
        }
        if (logLevels.includes(level)) {
            console.error(`${defaultConsoleColors.red}Smart Log Error: Cannot set debug level to an existing log level.${defaultConsoleColors.reset}`);
            return;
        }
        logLevelDebugName = level;
    }

    function setConsoleColors(colors: ColorMap): void {
        Object.assign(consoleColors, colors);
    }

    function addDefinition<T>(definition: SmartLogDefinition<T>): void {
        definitions.push(definition);
    }

    function smartLog<T>(input: SmartLogInput<T>): void {
        const level: string = input.level || '';
        if (level === logLevelDebugName && !settings.debugLogsEnabled) {
            return;
        }
        const category: string = input.category || '';
        const content: T = input.content;
        const displayedContentKeys: string[] | undefined = input.displayedContentKeys;
        let message: string;
        if (displayedContentKeys && displayedContentKeys.length > 0) {
            const messageValues = displayedContentKeys.map(key =>
                String(input.content[key as keyof T] || '')
            ).filter(value => value !== '');
            message = messageValues.length > 0 ? messageValues.join(' - ') : convertToString(content);
        } else {
            message = convertToString(content);
        }
        if (settings.consoleLoggingEnabled) {
            consoleLog({
                level: level,
                category: category,
                message: message
            } satisfies ConsoleLogInput);
        }
        for (let i = 0; i < definitions.length; i++) {
            const def = definitions[i];
            if (def.category === category) {
                def.insertFunction(input);
                return;
            }
        }
        console.error(`${defaultConsoleColors.red}Smart Log Error: No definition found for category: ${category}${defaultConsoleColors.reset}`);
    }


    async function smartLogAwait<T>(input: SmartLogInput<T>): Promise<void> {
        try {
            const level: string = input.level || '';
            if (level === logLevelDebugName && !settings.debugLogsEnabled) {
                return;
            }
            const category: string = input.category || '';
            const content: T = input.content;
            const displayedContentKeys: string[] | undefined = input.displayedContentKeys;
            let message: string;
            if (displayedContentKeys && displayedContentKeys.length > 0) {
                const messageValues = displayedContentKeys.map(key =>
                    String(input.content[key as keyof T] || '')
                ).filter(value => value !== '');
                message = messageValues.length > 0 ? messageValues.join(' - ') : convertToString(content);
            } else {
                message = convertToString(content);
            }
            if (settings.consoleLoggingEnabled) {
                consoleLog({
                    level: level,
                    category: category,
                    message: message
                } satisfies ConsoleLogInput);
            }

            for (let i = 0; i < definitions.length; i++) {
                const def = definitions[i];
                if (def.category === category) {
                    await def.insertFunction(input);
                    return;
                }
            }
            throw new Error(`Smart Log Error: No definition found for category: ${category}`);
        } catch (er) {
            console.error(`${defaultConsoleColors.red}SMART LOG ERROR: ${er}${defaultConsoleColors.reset}`);
        }
    }

    function consoleLog(input: ConsoleLogInput | string): void {
        if (typeof input === 'string') {
            console.log(`${defaultConsoleColors.cyan}${input}${defaultConsoleColors.reset}`);
            return;
        }

        const level = input.level || 'default';
        if (level === logLevelDebugName && !settings.debugLogsEnabled) {
            return;
        }

        let dateTime: string = '';
        if (settings.consoleDateTimeEnabled) {
            dateTime = `${formatDateTimeForConsole()} - `;
        }
        const levelUpper = level.toUpperCase();
        const categoryUpper = input.category?.toUpperCase() || '';
        const message = input.message || '';
        const adjustedLevel = levelUpper.length > 9
            ? levelUpper.substring(0, 9) + ' ' + '- '
            : levelUpper.padEnd(10, ' ') + '- ';
        const adjustedCategory = categoryUpper.length === 0
            ? ''
            : categoryUpper.length > 9
                ? categoryUpper.substring(0, 9) + ' ' + '- '
                : categoryUpper.padEnd(10, ' ') + '- ';

        for (let i = 0; i < consoleLogDefinitions.length; i++) {
            const def = consoleLogDefinitions[i];
            if (def.level === level) {
                const color = consoleColors[def.color || 'reset'] || consoleColors.reset;
                console.log(`${color}${adjustedLevel}${adjustedCategory}${dateTime}${def.prefix || ''}${message}${def.suffix || ''}${defaultConsoleColors.reset}`);
                return;
            }
        }
        console.log(`${defaultConsoleColors.cyan}${adjustedLevel}${dateTime}${message}${defaultConsoleColors.reset}`);
    }

    return {
        setSettings,
        setLogLevels,
        setLogLevelDebug,
        setConsoleColors,
        addDefinition,
        smartLog,
        smartLogAwait,
        consoleLog
    }
}

export default {
    createSmartLogInstance
};
