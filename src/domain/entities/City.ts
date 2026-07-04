export class City {
  constructor(
    public readonly id: string,
    public name: string,
    public uf: string,
    public readonly createdAt: Date,
  ) {}
}
