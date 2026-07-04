export class DoneCoolAction {
  constructor(
    public readonly id: string,
    public userId: string,
    public description: string,
    public neighborhood: string,
    public street: string,
    public actionPhotoURL: string,
    public coolActionId: string,
    public readonly createdAt: Date,
    public readonly cityId: string,
  ) {}
}
