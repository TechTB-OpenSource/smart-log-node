export class ValidationError extends Error {
    statusCode = 400;
    
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends Error {
    statusCode = 404;
    
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class AuthenticationError extends Error {
    statusCode = 401;
    
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class DatabaseError extends Error {
    statusCode = 500;
    
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}
