export type SolicitationStatus =
  | 'waiting_approval'
  | 'not_resolved'
  | 'in_progress'
  | 'resolved'
  | 'unconsidered';

export interface UpdateSolicitationDTO {
  title?: string;
  description?: string;
  neighborhood?: string;
  street?: string;
  cep?: string;
  status?: SolicitationStatus;
  solvedImageUrls?: string[];
  solvedDate?: Date;
  solvedCommentary?: string;
  solvedUserId?: string;
}
