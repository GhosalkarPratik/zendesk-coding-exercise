import { Injectable } from '@nestjs/common';
import {
  BackendChallengeIntentsPost200Response,
  BackendChallengeIntentsPostOperationRequest,
  Configuration,
  IntentsApi,
} from '../../generated/intents-api';
import { IntentApiResponse } from 'src/reply-generator/reply-generator.models';

@Injectable()
export class IntentsApiClient {
  private client: IntentsApi;

  constructor() {
    const config = new Configuration({
      basePath: process.env.INTENTS_API_BASE_URL,
      apiKey: process.env.INTENTS_API_KEY,
    });

    this.client = new IntentsApi(config);
  }

  async getIntent(message: string, botId: string): Promise<IntentApiResponse> {
    try {
      const response = await this.client.backendChallengeIntentsPost(
        this.generateRequest(message, botId),
      );
      return this.generateResponse(response);
    } catch (error) {
      throw error;
    }
  }

  private generateRequest(
    message: string,
    botId: string,
  ): BackendChallengeIntentsPostOperationRequest {
    return {
      backendChallengeIntentsPostRequest: {
        botId,
        message,
      },
    };
  }

  private generateResponse(
    response: BackendChallengeIntentsPost200Response,
  ): IntentApiResponse {
    if (!response.intents || !response.intents.length) {
      return [];
    }

    delete response.entities;

    return response.intents;
  }
}
