function convertToString<T>(content: T): string {
    if (content === null) return 'null';
    if (content === undefined) return 'undefined';
    if (typeof content === 'string') return content;
    if (typeof content === 'number' || typeof content === 'boolean') return String(content);
    if (Array.isArray(content)) {
        try {
            return content.map(item => convertToString(item)).join(', ');
        } catch (error) {
            return '[Array]';
        }
    }
    if (typeof content === 'object') {
        try {
            return Object.entries(content as Record<string, any>)
                .map(([key, value]) => `${key}: ${convertToString(value)}`)
                .join(' - ');
        } catch (error) {
            return '[Object object]';
        }
    }
    return String(content);
}

function formatDateTimeForConsole(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timeString = now.toTimeString().substring(0, 8);
    return `${year}-${month}-${day}_${timeString}`;
}

export default {
    convertToString,
    formatDateTimeForConsole
};
