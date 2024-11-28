import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ReplyGeneratorService } from './reply-generator.service';
import { InputQuery } from './reply-generator.validator';
import { QueryResponse } from './reply-generator.models';

@Controller()
export class ReplyGeneratorController {
  constructor(private readonly replyGeneratorService: ReplyGeneratorService) {}

  @Post('/api/v1/reply')
  @HttpCode(200)
  getReply(@Body() body: InputQuery): Promise<QueryResponse> {
    return this.replyGeneratorService.getReply(body.message, body.botId);
  }
}
