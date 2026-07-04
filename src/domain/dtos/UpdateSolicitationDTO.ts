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
  isCollective?: boolean;
  solvedImageUrls?: string[];
  solvedDate?: Date;
  solvedCommentary?: string;
  solvedUserId?: string;
}
