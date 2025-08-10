import type { Settings, LogDefinition, LogCommonInput, LogConsoleInput, ColorMap, ConsoleLogDefinition } from './_models.js';
import { defaultConsoleColors, defaultConsoleDefinitions, defaultLogLevels } from './_defaults.js';
import _utils from './_utils.js';

const { convertToString } = _utils;

function createSmartLogInstance() {
    const definitions: LogDefinition<any>[] = [];
    const ConsoleLogDefinitions: ConsoleLogDefinition[] = defaultConsoleDefinitions;
    const logLevels: string[] = defaultLogLevels;
    const consoleColors: ColorMap = defaultConsoleColors;
    const settings: Settings = {
        consoleLoggingEnabled: false
    };

    function setSettings(newSettings: Settings): void {
        settings.consoleLoggingEnabled = newSettings.consoleLoggingEnabled;
    }

    function setLogLevels(levels: string[]): void {
        logLevels.length = 0;
        logLevels.push(...levels);
    }

    function setConsoleColors(colors: ColorMap): void {
        Object.assign(consoleColors, colors);
    }

    function addDefinition<T>(definition: LogDefinition<T>): void {
        definitions.push(definition);
    }

    function log<T>(input: LogCommonInput<T>): void {
        const level: string = input.level || '';
        const category: string = input.category || '';
        const content: T = input.content;
        const messageKey: string | undefined = input.messageKey;
        let message: string;
        if (messageKey) {
            const messageValue = input.content[messageKey as keyof T] || convertToString(content);
            message = String(messageValue);
        } else {
            message = convertToString(content);
        }
        if (settings.consoleLoggingEnabled) {
            consoleLog({
                level: level,
                category: category,
                message: message
            } satisfies LogConsoleInput);
        }
        for (let i = 0; i < definitions.length; i++) {
            const def = definitions[i];
            if (def.category === category) {
                def.insertFunction(input);
                return;
            }
        }
    }


    async function logAwait<T>(input: LogCommonInput<T>): Promise<void> {
        try {
            const level: string = input.level || '';
            const category: string = input.category || '';
            const content: T = input.content;
            const messageKey: string | undefined = input.messageKey;
            let message: string;
            if (messageKey) {
                const messageValue = input.content[messageKey as keyof T] || convertToString(content);
                message = String(messageValue);
            } else {
                message = convertToString(content);
            }
            if (settings.consoleLoggingEnabled) {
                consoleLog({
                    level: level,
                    category: category,
                    message: message
                } satisfies LogConsoleInput);
            }
            for (let i = 0; i < definitions.length; i++) {
                const def = definitions[i];
                if (def.category === category) {
                    await def.insertFunction(input);
                    return;
                }
            }
        } catch (error) {
            console.error(`${defaultConsoleColors.red}Error in logAsync: ${error}${defaultConsoleColors.reset}`);
        }
    }

    function consoleLog(input: LogConsoleInput | string): void {
        if (typeof input === 'string') {
            console.log(input);
            return;
        }
        const level = input.level || 'default';
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

        for (let i = 0; i < ConsoleLogDefinitions.length; i++) {
            const def = ConsoleLogDefinitions[i];
            if (def.level === level) {
                const color = consoleColors[def.color || 'reset'] || consoleColors.reset;
                console.log(`${color}${adjustedLevel}${adjustedCategory}${def.prefix || ''}${message}${def.suffix || ''}[0m`);
                return;
            }
        }
        console.log(`[0m${adjustedLevel}- ${message}`);
    }

    return {
        setSettings,
        setLogLevels,
        setConsoleColors,
        addDefinition,
        log,
        logAwait,
        consoleLog
    }
}

export default {
    createSmartLogInstance
};
