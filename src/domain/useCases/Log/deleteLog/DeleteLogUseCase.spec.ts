import { DeleteLogUseCase } from './DeleteLogUseCase.js';
import { ILogRepository } from '../../../repositories/ILogRepository.js';
import { Log } from '../../../entities/Log.js';
import { CreateLogDTO } from '../../../dtos/CreateLogDTO.js';
import { UpdateLogDTO } from '../../../dtos/UpdateLogDTO.js';
import { AppError } from '../../../errors/AppError.js';

class FakeLogRepository implements ILogRepository {
  private logs: Log[] = [];

  async create(data: CreateLogDTO): Promise<Log> {
    const log = new Log(
      crypto.randomUUID(),
      data.userId,
      data.userName,
      data.email,
      data.activityDescription,
      new Date(),
      'default-city',
    );

    this.logs.push(log);

    return log;
  }

  async findById(id: string): Promise<Log | null> {
    return this.logs.find((log) => log.id === id) ?? null;
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<{ data: Log[]; total: number }> {
    const start = (page - 1) * perPage;
    const data = this.logs.slice(start, start + perPage);

    return { data, total: this.logs.length };
  }

  async update(id: string, data: UpdateLogDTO): Promise<Log> {
    const index = this.logs.findIndex((log) => log.id === id);

    if (index < 0) {
      throw new Error('Log not found');
    }

    const log = this.logs[index];

    if (data.userId !== undefined) log.userId = data.userId;
    if (data.userName !== undefined) log.userName = data.userName;
    if (data.email !== undefined) log.email = data.email;
    if (data.activityDescription !== undefined)
      log.activityDescription = data.activityDescription;

    return log;
  }

  async delete(id: string): Promise<void> {
    this.logs = this.logs.filter((log) => log.id !== id);
  }
}

describe('DeleteLogUseCase', () => {
  let deleteLogUseCase: DeleteLogUseCase;
  let fakeLogRepository: FakeLogRepository;

  beforeEach(() => {
    fakeLogRepository = new FakeLogRepository();
    deleteLogUseCase = new DeleteLogUseCase(fakeLogRepository);
  });

  it('should delete a log', async () => {
    const created = await fakeLogRepository.create({
      userId: 'user-123',
      userName: 'Pablo Silva',
      email: 'pablo@email.com',
      activityDescription: 'Logged in',
    });

    await deleteLogUseCase.execute(created.id);

    const found = await fakeLogRepository.findById(created.id);

    expect(found).toBeNull();
  });

  it('should throw AppError when log is not found', async () => {
    await expect(deleteLogUseCase.execute('non-existent-id')).rejects.toThrow(
      AppError,
    );

    await expect(deleteLogUseCase.execute('non-existent-id')).rejects.toThrow(
      'Log not found',
    );
  });
});
