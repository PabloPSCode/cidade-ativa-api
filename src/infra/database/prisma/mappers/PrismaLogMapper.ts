import { Log } from '../../../../domain/entities/Log.js';

type PrismaLog = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  activityDescription: string;
  createdAt: Date;
};

export class PrismaLogMapper {
  static toDomain(raw: PrismaLog): Log {
    return new Log(
      raw.id,
      raw.userId,
      raw.userName,
      raw.email,
      raw.activityDescription,
      raw.createdAt,
    );
  }

  static toPersistence(log: Log) {
    return {
      id: log.id,
      userId: log.userId,
      userName: log.userName,
      email: log.email,
      activityDescription: log.activityDescription,
      createdAt: log.createdAt,
    };
  }
}
