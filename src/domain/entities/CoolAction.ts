export class CoolAction {
  constructor(
    public readonly id: string,
    public solicitationTypeId: string,
    public solicitationId: string,
    public readonly createdAt: Date,
  ) {}
}
