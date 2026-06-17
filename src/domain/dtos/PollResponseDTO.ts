import { PollStatus } from '../entities/Poll.js';

export interface PollResponseDTO {
  id: string;
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  status: PollStatus;
  createdAt: Date;
  updatedAt: Date | null;
}
