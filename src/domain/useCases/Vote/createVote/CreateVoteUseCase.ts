import { AppError } from '../../../errors/AppError.js';
import { CreateVoteDTO } from '../../../dtos/CreateVoteDTO.js';
import { VoteResponseDTO } from '../../../dtos/VoteResponseDTO.js';
import { IVoteRepository } from '../../../repositories/IVoteRepository.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';
import { IPollRepository } from '../../../repositories/IPollRepository.js';

export class CreateVoteUseCase {
  constructor(
    private readonly repository: IVoteRepository,
    private readonly userRepository: IUserRepository,
    private readonly pollRepository: IPollRepository,
  ) {}

  async execute(data: CreateVoteDTO): Promise<VoteResponseDTO> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) throw new AppError('Usuário não encontrado.', 404);

    const poll = await this.pollRepository.findById(data.pollId);
    if (!poll) throw new AppError('Enquete não encontrada.', 404);

    const vote = await this.repository.create(data);
    return {
      id: vote.id,
      title: vote.title,
      description: vote.description,
      pollId: vote.pollId,
      userId: vote.userId,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }
}
