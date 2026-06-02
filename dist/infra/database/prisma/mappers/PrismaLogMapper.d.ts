import { Log } from '../../../../domain/entities/Log.js';
type PrismaLog = {
    id: string;
    userId: string;
    userName: string;
    email: string;
    activityDescription: string;
    createdAt: Date;
};
export declare class PrismaLogMapper {
    static toDomain(raw: PrismaLog): Log;
    static toPersistence(log: Log): {
        id: string;
        userId: string;
        userName: string;
        email: string;
        activityDescription: string;
        createdAt: Date;
    };
}
export {};
