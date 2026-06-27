export type SolicitationStatus =
  | 'waiting_approval'
  | 'not_resolved'
  | 'in_progress'
  | 'resolved'
  | 'unconsidered';

export interface SolicitationResponseDTO {
  id: string;
  protocolNumber: number;
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  uf: string;
  street: string;
  cep: string;
  requestingUserId: string;
  requestingUserName: string;
  solicitationTypeId: string;
  status: SolicitationStatus;
  isCollective: boolean;
  unsolvedImageUrls: string[];
  solvedImageUrls: string[] | null;
  solvedDate: Date | null;
  solvedCommentary: string | null;
  solvedUserId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
