export interface CreateSolicitationDTO {
  title: string;
  description: string;
  neighborhood: string;
  street: string;
  requestingUserId: string;
  solicitationTypeId: string;
  unsolvedImageUrls?: string[];
}
