export class SolicitationSignature {
  constructor(
    public readonly id: string,
    public imageUrl: string,
    public userName: string,
    public userId: string,
    public solicitationId: string,
    public createdAt: Date,
  ) {}
}
