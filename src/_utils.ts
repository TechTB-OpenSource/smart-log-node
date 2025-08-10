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

export default {
    convertToString
};
