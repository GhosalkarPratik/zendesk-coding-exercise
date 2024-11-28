import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyGeneratorService } from './reply-generator.service';
import { ReplyGeneratorController } from './reply-generator.controller';
import { IntentSchema } from '../database/mongodb/schema/intent';
import { ReplySchema } from '../database/mongodb/schema/reply';
import { IntentsInterpreterModule } from '../intents-interpreter/intents-interpreter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Intent', schema: IntentSchema },
      { name: 'Reply', schema: ReplySchema },
    ]),
    IntentsInterpreterModule,
  ],
  controllers: [ReplyGeneratorController],
  providers: [ReplyGeneratorService],
})
export class ReplyGeneratorModule {}
