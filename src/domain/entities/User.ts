export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public isCouncilman: boolean,
    public isAdmin: boolean,
    public address: string,
    public neighborhood: string,
    public city: string,
    public uf: string,
    public readonly createdAt: Date,
  ) {}
}
