export class Log {
  constructor(
    public readonly id: string,
    public userId: string,
    public userName: string,
    public email: string,
    public activityDescription: string,
    public readonly createdAt: Date,
  ) {}

  changeUserId(userId: string): void {
    if (!userId.trim()) {
      throw new Error('userId is required');
    }

    this.userId = userId;
  }

  changeUserName(userName: string): void {
    if (!userName.trim()) {
      throw new Error('userName is required');
    }

    this.userName = userName;
  }

  changeEmail(email: string): void {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }

    this.email = email;
  }

  changeActivityDescription(activityDescription: string): void {
    if (!activityDescription.trim()) {
      throw new Error('activityDescription is required');
    }

    this.activityDescription = activityDescription;
  }
}
