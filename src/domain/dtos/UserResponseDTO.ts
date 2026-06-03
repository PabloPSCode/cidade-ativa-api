export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  isCouncilman: boolean;
  isAdmin: boolean;
  address: string;
  neighborhood: string;
  city: string;
  uf: string;
  createdAt: Date;
}
