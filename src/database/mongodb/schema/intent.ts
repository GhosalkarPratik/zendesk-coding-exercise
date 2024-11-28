import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Intent {
  @Prop({ index: true, required: true, unique: true })
  name: string;
}

export const IntentSchema = SchemaFactory.createForClass(Intent);
