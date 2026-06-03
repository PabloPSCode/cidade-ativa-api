export type SolicitationStatus = 'not_resolved' | 'in_progress' | 'resolved' | 'unconsidered';

export class Solicitation {
  constructor(
    public readonly id: string,
    public protocolNumber: string | null,
    public title: string,
    public description: string,
    public neighborhood: string,
    public city: string,
    public uf: string,
    public street: string,
    public requestingUserId: string,
    public solicitationTypeId: string,
    public status: SolicitationStatus,
    public unsolvedImageUrls: string[],
    public solvedImageUrls: string[] | null,
    public solvedDate: Date | null,
    public solvedCommentary: string | null,
    public solvedUserId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date | null,
  ) {}
}
