import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryResponse } from './reply-generator.models';
import { Intent } from '../database/mongodb/schema/intent';
import { Reply } from '../database/mongodb/schema/reply';
import { IntentsApiClient } from '../intents-interpreter/intents-interpreter.client';

@Injectable()
export class ReplyGeneratorService {
  private readonly DEFAULT_REPLY: QueryResponse = JSON.parse(
    process.env.STRINGIFIED_DEFAULT_REPLY,
  );
  constructor(
    @InjectModel(Intent.name) private intentModel: Model<Intent>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    private intentsApiClient: IntentsApiClient,
  ) {}

  async getReply(message: string, botId: string): Promise<QueryResponse> {
    const intents = await this.intentsApiClient.getIntent(message, botId);

    if (!intents.length) {
      return this.DEFAULT_REPLY;
    }

    intents.sort((a, b) => b.confidence - a.confidence);

    for (const intent of intents) {
      const reply = await this.findBestReply(intent.name, intent.confidence);

      if (reply) {
        return {
          intent: intent.name,
          confidence: intent.confidence,
          reply: reply.text,
        };
      }
    }

    return this.DEFAULT_REPLY;
  }

  private async findBestReply(
    intentName: string,
    confidence: number,
  ): Promise<Reply | null> {
    const intent = await this.intentModel.findOne({ name: intentName }).exec();
    if (!intent) {
      return;
    }

    return this.replyModel
      .findOne({
        intentId: intent._id,
        threshold: { $lte: confidence },
      })
      .sort({ threshold: -1 })
      .exec();
  }
}
