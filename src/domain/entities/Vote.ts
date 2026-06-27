export class Vote {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public pollId: string,
    public userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date | null,
    public readonly cityId: string,
  ) {}
}
