import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReplyIntentDataRequest } from './data-populator.models';
import { Intent } from '../../database/mongodb/schema/intent';
import { Reply } from '../../database/mongodb/schema/reply';

@Injectable()
export class DataPopulatorService {
  constructor(
    @InjectModel(Intent.name) private intentModel: Model<Intent>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
  ) {}

  async loadData(replyIntentData: ReplyIntentDataRequest): Promise<void> {
    for (const data of replyIntentData) {
      let intentId: Types.ObjectId;
      const intentInDB = await this.intentModel
        .findOne({ name: data.intent })
        .exec();

      if (!intentInDB) {
        const newIntent = new this.intentModel({ name: data.intent });
        const savedIntent = await newIntent.save();
        intentId = savedIntent._id;
      } else {
        intentId = intentInDB._id;
      }

      const newReply = new this.replyModel({
        intentId,
        text: data.reply,
        threshold: data.threshold,
      });
      await newReply.save();
    }
  }
}
