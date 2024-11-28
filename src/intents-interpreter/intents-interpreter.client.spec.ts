import { IntentsApi, Configuration } from '../../generated/intents-api';
import { IntentsApiClient } from './intents-interpreter.client';

jest.mock('../../generated/intents-api');

describe('IntentsApiClient', () => {
  let intentsApiClient: IntentsApiClient;
  let mockIntentsApi: jest.Mocked<IntentsApi>;
  const message = 'hello';
  const botId = 'testBot';
  const apiResponse = {
    intents: [{ name: 'Greeting', confidence: 0.9 }],
  };

  beforeAll(async () => {
    mockIntentsApi = new IntentsApi(
      new Configuration(),
    ) as jest.Mocked<IntentsApi>;
    intentsApiClient = new IntentsApiClient();
    intentsApiClient['client'] = mockIntentsApi;
  });

  afterEach(() => {
    mockIntentsApi.backendChallengeIntentsPost.mockReset();
  });

  describe('getIntent', () => {
    it('should return processed response on successful API call', async () => {
      mockIntentsApi.backendChallengeIntentsPost.mockResolvedValueOnce(
        apiResponse,
      );
      const actual = await intentsApiClient.getIntent(message, botId);

      expect(actual).toEqual(apiResponse.intents);
      expect(mockIntentsApi.backendChallengeIntentsPost).toHaveBeenCalledWith({
        backendChallengeIntentsPostRequest: {
          botId,
          message,
        },
      });
    });

    it('should return processed response on successful API call with empty intents', async () => {
      mockIntentsApi.backendChallengeIntentsPost.mockResolvedValueOnce({
        intents: [],
      });
      const actual = await intentsApiClient.getIntent(message, botId);

      expect(actual).toEqual([]);
      expect(mockIntentsApi.backendChallengeIntentsPost).toHaveBeenCalledWith({
        backendChallengeIntentsPostRequest: {
          botId,
          message,
        },
      });
    });

    it('should throw if API call fails', async () => {
      mockIntentsApi.backendChallengeIntentsPost.mockRejectedValueOnce(
        new Error('API call failed'),
      );

      try {
        const actual = await intentsApiClient.getIntent(message, botId);
        expect(actual).toBeFalsy();
      } catch (e) {
        expect(e.message).toEqual('API call failed');
      }
      expect(mockIntentsApi.backendChallengeIntentsPost).toHaveBeenCalledWith({
        backendChallengeIntentsPostRequest: {
          botId,
          message,
        },
      });
    });
  });
});
