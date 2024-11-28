import { Module } from '@nestjs/common';
import { IntentsApiClient } from './intents-interpreter.client';

@Module({
  providers: [IntentsApiClient],
  exports: [IntentsApiClient],
})
export class IntentsInterpreterModule {}
