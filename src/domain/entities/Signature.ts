export class Signature {
  constructor(
    public readonly id: string,
    public imageUrl: string,
    public userName: string,
    public userId: string,
    public solicitationId: string | null,
  ) {}
}
