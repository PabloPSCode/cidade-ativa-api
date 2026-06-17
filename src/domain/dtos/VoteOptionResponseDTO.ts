export interface VoteOptionResponseDTO {
  id: string;
  optionText: string;
  voteId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
