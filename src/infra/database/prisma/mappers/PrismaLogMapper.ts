import { Log } from '../../../../domain/entities/Log.js';

type PrismaLog = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  activityDescription: string;
  cityId: string;
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
      raw.cityId,
    );
  }

  static toPersistence(log: Log) {
    return {
      id: log.id,
      userId: log.userId,
      userName: log.userName,
      email: log.email,
      activityDescription: log.activityDescription,
      cityId: log.cityId,
      createdAt: log.createdAt,
    };
  }
}
