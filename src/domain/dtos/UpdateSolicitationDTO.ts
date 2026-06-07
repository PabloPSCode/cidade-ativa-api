export type SolicitationStatus =
  | 'not_resolved'
  | 'in_progress'
  | 'resolved'
  | 'unconsidered';

export interface UpdateSolicitationDTO {
  title?: string;
  description?: string;
  neighborhood?: string;
  city?: string;
  uf?: string;
  street?: string;
  status?: SolicitationStatus;
  solvedImageUrls?: string[];
  solvedDate?: Date;
  solvedCommentary?: string;
  solvedUserId?: string;
}
