import { Body, Controller, Post } from '@nestjs/common';
import { ReplyIntentDataRequest } from './data-populator.models';
import { DataPopulatorService } from './data-populator.service';

@Controller()
export class DataPopulatorController {
  constructor(private readonly dataPopulatorService: DataPopulatorService) {}

  @Post('/internal/reply-intent-data')
  addReplyIntentData(
    @Body() replyIntentData: ReplyIntentDataRequest,
  ): Promise<void> {
    return this.dataPopulatorService.loadData(replyIntentData);
  }
}
