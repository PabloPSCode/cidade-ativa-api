export declare class AppError extends Error {
    readonly message: string;
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
