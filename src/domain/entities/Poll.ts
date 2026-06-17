export type PollStatus = 'active' | 'inactive' | 'finished';

export class Poll {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public pollCoverUrl: string,
    public startedAt: Date | null,
    public finishedAt: Date | null,
    public status: PollStatus,
    public readonly createdAt: Date,
    public updatedAt: Date | null,
  ) {}
}
