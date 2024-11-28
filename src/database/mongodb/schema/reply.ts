import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Reply {
  @Prop({ required: true })
  text: string;

  @Prop({ index: true, required: true })
  threshold: number;

  @Prop({ index: true, type: Types.ObjectId, ref: 'Intent', required: true })
  intentId: Types.ObjectId;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
