export interface CreateSolicitationDTO {
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  uf: string;
  street: string;
  requestingUserId: string;
  solicitationTypeId: string;
  unsolvedImageUrls?: string[];
}
