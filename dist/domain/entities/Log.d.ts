export declare class Log {
    readonly id: string;
    userId: string;
    userName: string;
    email: string;
    activityDescription: string;
    readonly createdAt: Date;
    constructor(id: string, userId: string, userName: string, email: string, activityDescription: string, createdAt: Date);
    changeUserId(userId: string): void;
    changeUserName(userName: string): void;
    changeEmail(email: string): void;
    changeActivityDescription(activityDescription: string): void;
}
