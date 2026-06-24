import { PollStatus } from '../entities/Poll.js';

export interface UpdatePollDTO {
  title?: string;
  description?: string;
  pollCoverUrl?: string;
  startedAt?: Date;
  finishedAt?: Date;
  status?: PollStatus;
}
