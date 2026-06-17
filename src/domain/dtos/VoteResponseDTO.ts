export interface VoteResponseDTO {
  id: string;
  title: string;
  description: string;
  pollId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
