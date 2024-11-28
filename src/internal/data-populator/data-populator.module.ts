import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataPopulatorController } from './data-populator.controller';
import { DataPopulatorService } from './data-populator.service';
import { IntentSchema } from '../../database/mongodb/schema/intent';
import { ReplySchema } from '../../database/mongodb/schema/reply';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Intent', schema: IntentSchema },
      { name: 'Reply', schema: ReplySchema },
    ]),
  ],
  controllers: [DataPopulatorController],
  providers: [DataPopulatorService],
})
export class DataPopulatorModule {}
