import { ReplyGeneratorController } from './reply-generator.controller';
import { ReplyGeneratorService } from './reply-generator.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Reply GeneratorController', () => {
  let controller: ReplyGeneratorController;
  let replyGeneratorService: ReplyGeneratorService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReplyGeneratorController],
      providers: [
        {
          provide: ReplyGeneratorService,
          useValue: {
            getReply: jest.fn(),
          },
        },
      ],
    }).compile();

    replyGeneratorService = moduleRef.get<ReplyGeneratorService>(
      ReplyGeneratorService,
    );
    controller = moduleRef.get<ReplyGeneratorController>(
      ReplyGeneratorController,
    );
  });

  it('should return response when request is valid', () => {
    const expected = {
      intent: 'Intent',
      confidence: 0.7,
      reply: 'Reply',
    };
    jest
      .spyOn(replyGeneratorService, 'getReply')
      .mockImplementation(() => Promise.resolve(expected));

    const actual = controller.getReply({
      botId: 'botId',
      message: 'Hello World!',
    });

    expect(actual).resolves.toBe(expected);
  });

  it('should return internal error response when request fails', async () => {
    jest
      .spyOn(replyGeneratorService, 'getReply')
      .mockImplementation(() => Promise.reject(new Error('Internal Error')));

    try {
      await controller.getReply({
        botId: 'botId',
        message: 'Hello World!',
      });
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('Internal Error');
    }
  });
});
