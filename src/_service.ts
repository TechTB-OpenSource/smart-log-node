import type { SmartLogSettings, SmartLogSettingsInput, SmartLogDefinition, SmartLogInput, ConsoleLogInput, ColorMap, ConsoleLogDefinition } from './_models.js';
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
    const allDefinitions: SmartLogDefinition<any>[] = [];
    const consoleLogDefinitions: ConsoleLogDefinition[] = defaultConsoleLogDefinitions;
    const logLevels: string[] = defaultLogLevels;
    let logLevelDebugName: string = defaultLogLevelDebugName;
    const consoleColors: ColorMap = defaultConsoleColors;
    const settings: SmartLogSettings = defaultSettings;

    function resetSettings(): void {
        settings.debugLogsEnabled = defaultSettings.debugLogsEnabled;
        settings.consoleLoggingEnabled = defaultSettings.consoleLoggingEnabled;
        settings.consoleDateTimeEnabled = defaultSettings.consoleDateTimeEnabled;
        settings.consoleLevelLength = defaultSettings.consoleLevelLength;
        settings.consoleNameLength = defaultSettings.consoleNameLength;
        settings.dataLoggingEnabled = defaultSettings.dataLoggingEnabled;
    }

    function setSettings(newSettings: SmartLogSettingsInput): void {
        if (newSettings.consoleLoggingEnabled !== undefined) {
            settings.consoleLoggingEnabled = newSettings.consoleLoggingEnabled;
        }

        if (newSettings.consoleDateTimeEnabled !== undefined) {
            settings.consoleDateTimeEnabled = newSettings.consoleDateTimeEnabled;
        }
        
        if (newSettings.debugLogsEnabled !== undefined) {
            settings.debugLogsEnabled = newSettings.debugLogsEnabled;
        }

        if (newSettings.consoleLevelLength !== undefined) {
            settings.consoleLevelLength = newSettings.consoleLevelLength;
        }

        if (newSettings.consoleNameLength !== undefined) {
            settings.consoleNameLength = newSettings.consoleNameLength;
        }

        if (newSettings.dataLoggingEnabled !== undefined) {
            settings.dataLoggingEnabled = newSettings.dataLoggingEnabled;
        }
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

    function addDefinition<T extends object>(definition: SmartLogDefinition<T>): void {
        allDefinitions.push(definition);
    }

    function smartLog<T extends object>(input: SmartLogInput<T>): void {
        const level: string = input.level || '';
        const definitionName: string = input.definitionName || '';
        const consoleLoggingEnabled: boolean = input.consoleLoggingEnabled !== undefined ? input.consoleLoggingEnabled : settings.consoleLoggingEnabled;
        const consoleDateTimeEnabled: boolean = input.consoleDateTimeEnabled !== undefined ? input.consoleDateTimeEnabled : settings.consoleDateTimeEnabled;
        const dataLoggingEnabled: boolean = input.dataLoggingEnabled !== undefined ? input.dataLoggingEnabled : settings.dataLoggingEnabled;
        const content: T = input.content;
        const displayedContentKeys: string[] | undefined = input.displayedContentKeys;
        let message: string;
        let consoleLogName: string = '';
        if (input.consoleName) {
            consoleLogName = input.consoleName;
        } else {
            consoleLogName = definitionName;
        }
        if (level === logLevelDebugName && !settings.debugLogsEnabled) {
            return;
        }
        if (displayedContentKeys && displayedContentKeys.length > 0) {
            const messageValues = displayedContentKeys.map(key =>
                String(input.content[key as keyof T] || '')
            ).filter(value => value !== '');
            message = messageValues.length > 0 ? messageValues.join(' - ') : convertToString(content);
        } else {
            message = convertToString(content);
        }
        if (consoleLoggingEnabled) {
            consoleLog({
                level: level,
                name: consoleLogName,
                dateTimeEnabled: consoleDateTimeEnabled,
                message: message
            } satisfies ConsoleLogInput);
        }
        if (dataLoggingEnabled) {
            for (let i = 0; i < allDefinitions.length; i++) {
                const def = allDefinitions[i];
                if (def.definitionName === definitionName) {
                    def.dataLogFunction(input);
                    return;
                }
            }
            console.error(`${defaultConsoleColors.red}Smart Log Error: No definition found for definitionName: ${definitionName}${defaultConsoleColors.reset}`);
        }
    }


    async function smartLogAwait<T extends object>(input: SmartLogInput<T>): Promise<void> {
        try {
            const level: string = input.level || '';
            if (level === logLevelDebugName && !settings.debugLogsEnabled) {
                return;
            }
            const definitionName: string = input.definitionName || '';
            const consoleLoggingEnabled: boolean = input.consoleLoggingEnabled !== undefined ? input.consoleLoggingEnabled : settings.consoleLoggingEnabled;
            const consoleDateTimeEnabled: boolean = input.consoleDateTimeEnabled !== undefined ? input.consoleDateTimeEnabled : settings.consoleDateTimeEnabled;
            const content: T = input.content;
            const dataLoggingEnabled: boolean = input.dataLoggingEnabled !== undefined ? input.dataLoggingEnabled : settings.dataLoggingEnabled;
            const displayedContentKeys: string[] | undefined = input.displayedContentKeys;
            let message: string;
            let consoleLogName: string = '';
            if (input.consoleName) {
                consoleLogName = input.consoleName;
            } else {
                consoleLogName = definitionName;
            }
            if (displayedContentKeys && displayedContentKeys.length > 0) {
                const messageValues = displayedContentKeys.map(key =>
                    String(input.content[key as keyof T] || '')
                ).filter(value => value !== '');
                message = messageValues.length > 0 ? messageValues.join(' - ') : convertToString(content);
            } else {
                message = convertToString(content);
            }
            if (consoleLoggingEnabled) {
                consoleLog({
                    level: level,
                    name: consoleLogName,
                    dateTimeEnabled: consoleDateTimeEnabled,
                    message: message
                } satisfies ConsoleLogInput);
            }
            if (dataLoggingEnabled) {
                for (let i = 0; i < allDefinitions.length; i++) {
                    const def = allDefinitions[i];
                    if (def.definitionName === definitionName) {
                        await def.dataLogFunction(input);
                        return;
                    }
                }
                throw new Error(`Smart Log Error: No definition found for definitionName: ${definitionName}`);
            }
        } catch (er) {
            console.error(`${defaultConsoleColors.red}SMART LOG ERROR: ${er}${defaultConsoleColors.reset}`);
        }
    }

    function consoleLog(input: ConsoleLogInput | string): void {
        if (typeof input === 'string') {
            console.log(`${defaultConsoleColors.cyan}${input}${defaultConsoleColors.reset}`);
            return;
        }


        const level = input.level || '';
        if (level === logLevelDebugName && !settings.debugLogsEnabled) {
            return;
        }

        let dateTimeEnabled: boolean = settings.consoleDateTimeEnabled;
        if (input.dateTimeEnabled) {
            dateTimeEnabled = input.dateTimeEnabled;
        }
        let dateTime: string = '';
        if (dateTimeEnabled) {
            dateTime = `${formatDateTimeForConsole()} - `;
        }

        const levelUpper = level.toUpperCase();
        const nameUpper = input.name?.toUpperCase() || '';
        const message = input.message || '';
        const adjustedLevel = levelUpper.length === 0
            ? ''
            : levelUpper.length > settings.consoleLevelLength!
                ? levelUpper.substring(0, settings.consoleLevelLength! - 1) + ' ' + '- '
                : levelUpper.padEnd(settings.consoleLevelLength!, ' ') + '- ';
        const adjustedCategory = nameUpper.length === 0
            ? ''
            : nameUpper.length > settings.consoleNameLength!
                ? nameUpper.substring(0, settings.consoleNameLength! - 1) + ' ' + '- '
                : nameUpper.padEnd(settings.consoleNameLength!, ' ') + '- ';
        const adjustedDateTime = dateTimeEnabled ? dateTime : '';
        for (let i = 0; i < consoleLogDefinitions.length; i++) {
            const def = consoleLogDefinitions[i];
            if (def.level === level) {
                const color = consoleColors[def.color || 'reset'] || consoleColors.reset;
                console.log(`${color}${adjustedDateTime}${adjustedLevel}${adjustedCategory}${def.prefix || ''}${message}${def.suffix || ''}${defaultConsoleColors.reset}`);
                return;
            }
        }
        console.log(`${defaultConsoleColors.reset}${adjustedDateTime}${adjustedLevel}${adjustedCategory}${message}`);
    }

    return {
        resetSettings,
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
