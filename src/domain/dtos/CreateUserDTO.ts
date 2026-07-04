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
  /** Tenant (cidade) escolhido no cadastro. Define o `cityId` do usuário. */
  cityId?: string;
}
