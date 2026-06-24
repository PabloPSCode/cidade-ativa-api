export class VoteOption {
  constructor(
    public readonly id: string,
    public optionText: string,
    public voteId: string,
    public readonly createdAt: Date,
    public updatedAt: Date | null,
  ) {}
}
