export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isCouncilman?: boolean;
  isAdmin?: boolean;
  address?: string;
  neighborhood?: string;
  city?: string;
  uf?: string;
}
