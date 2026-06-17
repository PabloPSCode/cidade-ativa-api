export class SolicitationType {
  constructor(
    public readonly id: string,
    public description: string,
  ) {}

  changeDescription(description: string): void {
    if (!description.trim()) throw new Error('Description is required');
    this.description = description;
  }
}
