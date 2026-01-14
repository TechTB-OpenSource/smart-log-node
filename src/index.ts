import _service from './_service.js';
import _defaults from './_defaults.js';

export const defaultSettings = { ..._defaults.defaultSettings };
export const defaultLogLevels = [..._defaults.defaultLogLevels];
export const defaultConsoleColors = { ..._defaults.defaultConsoleColors };
export const defaultConsoleLogDefinitions = _defaults.defaultConsoleLogDefinitions.map(def => ({ ...def }));
export const defaultLogLevelDebugName = _defaults.defaultLogLevelDebugName; // string is immutable

export const {
    createSmartLogInstance
} = _service;

export type {
    LogLevels,
    SmartLogSettingsInput,
    SmartLogDefinition,
    SmartLogInput,
    ConsoleLogInput,
    ConsoleLogDefinition
} from './_models.js';
