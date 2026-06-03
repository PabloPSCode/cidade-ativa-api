export class SolicitationType {
  constructor(
    public readonly id: string,
    public description: string,
    public points: number,
  ) {}

  changeDescription(description: string): void {
    if (!description.trim()) throw new Error('Description is required');
    this.description = description;
  }

  changePoints(points: number): void {
    if (points < 0) throw new Error('Points must be non-negative');
    this.points = points;
  }
}
