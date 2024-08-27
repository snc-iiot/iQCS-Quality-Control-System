import { Test, TestingModule } from '@nestjs/testing';
import { PartManagementService } from './part-management.service';

describe('PartManagementService', () => {
  let service: PartManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartManagementService],
    }).compile();

    service = module.get<PartManagementService>(PartManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
