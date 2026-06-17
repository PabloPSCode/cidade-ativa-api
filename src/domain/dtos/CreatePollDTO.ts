import { PollStatus } from '../entities/Poll.js';

export interface CreatePollDTO {
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt?: Date;
  finishedAt?: Date;
  status?: PollStatus;
}
