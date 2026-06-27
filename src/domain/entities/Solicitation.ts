export type SolicitationStatus =
  | 'waiting_approval'
  | 'not_resolved'
  | 'in_progress'
  | 'resolved'
  | 'unconsidered';

export class Solicitation {
  public requestingUserName?: string;

  constructor(
    public readonly id: string,
    public protocolNumber: number,
    public title: string,
    public description: string,
    public neighborhood: string,
    public city: string,
    public uf: string,
    public street: string,
    public cep: string,
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
    public readonly cityId: string,
  ) {}
}
