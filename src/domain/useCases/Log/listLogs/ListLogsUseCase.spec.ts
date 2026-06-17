import { ListLogsUseCase } from './ListLogsUseCase.js';
import { ILogRepository } from '../../../repositories/ILogRepository.js';
import { Log } from '../../../entities/Log.js';
import { CreateLogDTO } from '../../../dtos/CreateLogDTO.js';
import { UpdateLogDTO } from '../../../dtos/UpdateLogDTO.js';

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

describe('ListLogsUseCase', () => {
  let listLogsUseCase: ListLogsUseCase;
  let fakeLogRepository: FakeLogRepository;

  beforeEach(async () => {
    fakeLogRepository = new FakeLogRepository();
    listLogsUseCase = new ListLogsUseCase(fakeLogRepository);

    for (let i = 1; i <= 25; i++) {
      await fakeLogRepository.create({
        userId: `user-${i}`,
        userName: `User ${i}`,
        email: `user${i}@email.com`,
        activityDescription: `Action ${i}`,
      });
    }
  });

  it('should list logs with default pagination', async () => {
    const result = await listLogsUseCase.execute();

    expect(result.data).toHaveLength(10);
    expect(result.meta.page).toBe(1);
    expect(result.meta.perPage).toBe(10);
    expect(result.meta.total).toBe(25);
    expect(result.meta.totalPages).toBe(3);
  });

  it('should list logs with custom pagination', async () => {
    const result = await listLogsUseCase.execute({ page: 2, perPage: 5 });

    expect(result.data).toHaveLength(5);
    expect(result.meta.page).toBe(2);
    expect(result.meta.perPage).toBe(5);
    expect(result.meta.total).toBe(25);
    expect(result.meta.totalPages).toBe(5);
  });

  it('should return last page with remaining items', async () => {
    const result = await listLogsUseCase.execute({ page: 3, perPage: 10 });

    expect(result.data).toHaveLength(5);
    expect(result.meta.page).toBe(3);
    expect(result.meta.totalPages).toBe(3);
  });

  it('should enforce minimum page of 1', async () => {
    const result = await listLogsUseCase.execute({ page: -1, perPage: 10 });

    expect(result.meta.page).toBe(1);
  });

  it('should enforce maximum perPage of 100', async () => {
    const result = await listLogsUseCase.execute({ page: 1, perPage: 200 });

    expect(result.meta.perPage).toBe(100);
  });
});
