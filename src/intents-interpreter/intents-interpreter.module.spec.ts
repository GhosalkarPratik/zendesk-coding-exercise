import { Test, TestingModule } from '@nestjs/testing';
import { IntentsApiClient } from './intents-interpreter.client';
import { IntentsInterpreterModule } from './intents-interpreter.module';

describe('IntentsInterpreterModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [IntentsInterpreterModule],
    }).compile();
  });

  it('should provide IntentsApiClient', () => {
    const intentsApiClient = module.get<IntentsApiClient>(IntentsApiClient);
    expect(intentsApiClient).toBeDefined();
    expect(intentsApiClient).toBeInstanceOf(IntentsApiClient);
  });

  it('should export IntentsApiClient', async () => {
    const exportedProvider = module.get<IntentsApiClient>(IntentsApiClient);
    expect(exportedProvider).toBeDefined();
  });
});
