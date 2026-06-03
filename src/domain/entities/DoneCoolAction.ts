export class DoneCoolAction {
  constructor(
    public readonly id: string,
    public userId: string,
    public coolActionId: string,
    public solicitationId: string,
    public readonly createdAt: Date,
  ) {}
}
