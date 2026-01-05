# smart-log-node
A simple logging utility that makes simultaneous console and database logging easy.
***Smart log was build with TypeScript but is compatible with both TypeScript and vanilla JavaScript projects.***
***This README file is a first draft. Additional documentation will be coming in the future***

***Last Updated 01/05/2025***
<br>
<br>

## Getting Started
Smart log was build to allow for a single log function to produce a console log in addition to logging in database, file or both. This tool will also, add details and colors to console logs.

## Key Concepts
- **Log Instances** - All logging config is stored in a single log instance, that can be imported throughout an app.
- **Log Instance Settings** - The default log settings will likely work for most apps, however they can be changed if desired.
- **Console Log** - A console log is just a standard JS console log, though Smart Log Node will add details and colors.
- **Data Log** - Any log logic in addition to Console Logs that is defined in a log definition. This can be database or file logging for example. Smart Log Node deliberately keeps data logging simple and vague (A generic function) in order to allow the developer to have full control.
- **Log Level** - Logs are categorized into levels. Levels will help determine the console log color and are recommended to be used when producing data logs.
- **Log Definition** - A name combined with a function that contains the Data Log logic. If using Typescript, this is where Data Log function input types can be defined. This allows developers to maintain type safety when writing logs to databases or files.

## Configuration Defaults and Types
```js
defaultSettings: SmartLogSettings = {
    debugLogsEnabled: false,
    consoleLoggingEnabled: true,
    consoleLevelLength: 10,
    consoleNameLength: 15,
    consoleDateTimeEnabled: true,
    dataLoggingEnabled: true
};

defaultLogLevelDebugName: string = 'debug';

defaultLogLevels: LogLevels = [
    'info',
    'success',
    'warn',
    'error'
];

defaultConsoleColors: ColorMap = {
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

defaultConsoleLogDefinitions: ConsoleLogDefinition[] = [
    {
        level: "debug",
        color: 'cyan'
    },
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
```

### Import, create, and configure a new logging instance
```js
import { createSmartLogInstance } from 'smart-log-node';

const logInstance = createSmartLogInstance();

logInstance.setSettings({
    consoleLevelLength: 15,
    consoleNameLength: 20,
    consoleDateTimeEnabled: false
})
```

### Create a new log definition (Using "System" as the log definition example)
```js
logInstance.addDefinition({
    definitionName: 'system',
    dataLogFunction: async (logInput) => {
        /**
         * 
         * Database, file, or other logging logic should be placed here.
         * 
         */
    }
})
```
### Create a smart log (Non-blocking)
```js
logInstance.smartLog(
    level: 'info',
    definitionName: 'system',
    content: {
        message: 'System log message.'
        consoleLogMessage: 'System log message for console'
    },
    displayedContentKeys: [
        'consoleLogMessage'
    ]
)
```

### Create a smart log (Blocking)
```js
logInstance.smartLogAwait(
        level: 'info',
    definitionName: 'system',
    content: {
        message: 'System log message.'
    }
)
```

### Create a console only log with details and level colors
```js
logInstance.consoleLog(
    level: 'info',
    name: 'system',
    message: 'Console log message'
)
```

### Create a console only log with NO details default log level color
```js
logInstance.consoleLog('Console log message')
```
