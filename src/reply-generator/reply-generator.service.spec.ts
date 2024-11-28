import { Test, TestingModule } from '@nestjs/testing';
import { ReplyGeneratorService } from './reply-generator.service';
import { getModelToken } from '@nestjs/mongoose';
import { IntentsApiClient } from '../intents-interpreter/intents-interpreter.client';
import { Intent } from '../database/mongodb/schema/intent';
import { Reply } from '../database/mongodb/schema/reply';

describe('ReplyGeneratorService', () => {
  let service: ReplyGeneratorService;
  let intentsApiClient: IntentsApiClient;
  const DEFAULT_REPLY = { reply: 'Sorry, I didn’t understand that.' };
  let intentsApiClientMock: jest.Mocked<IntentsApiClient>;
  let intentModelMock: jest.Mocked<any>;
  let replyModelMock: jest.Mocked<any>;

  beforeEach(async () => {
    process.env.STRINGIFIED_DEFAULT_REPLY = JSON.stringify(DEFAULT_REPLY);
    intentsApiClientMock = {
      getIntent: jest.fn(),
    } as unknown as jest.Mocked<IntentsApiClient>;

    intentModelMock = {
      findOne: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    replyModelMock = {
      findOne: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyGeneratorService,
        { provide: getModelToken(Intent.name), useValue: intentModelMock },
        { provide: getModelToken(Reply.name), useValue: replyModelMock },
        { provide: IntentsApiClient, useValue: intentsApiClientMock },
      ],
    }).compile();

    service = module.get<ReplyGeneratorService>(ReplyGeneratorService);
    intentsApiClient = module.get<IntentsApiClient>(IntentsApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return DEFAULT_REPLY when no intents are returned', async () => {
    jest.spyOn(intentsApiClient, 'getIntent').mockResolvedValue([]);

    const result = await service.getReply('test message', 'test-bot');
    expect(result).toEqual(DEFAULT_REPLY);
  });

  it('should return reply for the highest confidence intent with matching threshold', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'farewell', confidence: 0.6 },
    ];
    const intentMock = { _id: 'intent-id' };
    const replyMock = { text: 'Hello there!', threshold: 0.75 };

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockResolvedValueOnce(intentMock);
    replyModelMock.exec.mockResolvedValueOnce(replyMock);

    const result = await service.getReply('Hello', 'bot-123');
    expect(result).toEqual({
      intent: 'greeting',
      confidence: 0.8,
      reply: 'Hello there!',
    });
  });

  it('should skip intents matching if intent is not present in the intents collection', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'initiate conversation', confidence: 0.75 },
    ];
    const intentMock = { _id: 'intent-id' };
    const replyMock = { text: 'Hello there!', threshold: 0.75 };

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(intentMock);
    replyModelMock.exec.mockResolvedValueOnce(replyMock);

    const result = await service.getReply('Hello', 'bot-123');
    expect(result).toEqual({
      intent: 'initiate conversation',
      confidence: 0.75,
      reply: 'Hello there!',
    });
  });

  it('should skip intents matching if no intents present in the intents collection', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'initiate conversation', confidence: 0.75 },
    ];

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockResolvedValue(null);

    const result = await service.getReply('Hello', 'bot-123');
    expect(result).toEqual(DEFAULT_REPLY);
  });

  it('should skip intents matching if reply is not present in the replies collection', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'initiate conversation', confidence: 0.75 },
    ];
    const intentMock = { _id: 'intent-id' };
    const replyMock = { text: 'Hello there!', threshold: 0.75 };

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockResolvedValue(intentMock);
    replyModelMock.exec
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(replyMock);

    const result = await service.getReply('Hello', 'bot-123');
    expect(result).toEqual({
      intent: 'initiate conversation',
      confidence: 0.75,
      reply: 'Hello there!',
    });
  });

  it('should skip intents matching if no reply present in the replies collection', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'initiate conversation', confidence: 0.75 },
    ];
    const intentMock = { _id: 'intent-id' };

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockResolvedValue(intentMock);
    replyModelMock.exec.mockResolvedValue(null);

    const result = await service.getReply('Hello', 'bot-123');
    expect(result).toEqual(DEFAULT_REPLY);
  });

  it('should throw error when intents collection query fails', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'farewell', confidence: 0.6 },
    ];

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockRejectedValueOnce(
      new Error('Intent DB call failed'),
    );

    try {
      await service.getReply('Hello', 'bot-123');
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('Intent DB call failed');
    }
  });

  it('should throw error when replies collection query fails', async () => {
    const intents = [
      { name: 'greeting', confidence: 0.8 },
      { name: 'farewell', confidence: 0.6 },
    ];
    const intentMock = { _id: 'intent-id' };

    intentsApiClientMock.getIntent.mockResolvedValueOnce(intents);
    intentModelMock.exec.mockResolvedValueOnce(intentMock);
    replyModelMock.exec.mockRejectedValueOnce(
      new Error('Reply DB call failed'),
    );

    try {
      await service.getReply('Hello', 'bot-123');
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('Reply DB call failed');
    }
  });
});
