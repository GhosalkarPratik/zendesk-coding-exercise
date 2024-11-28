import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyGeneratorModule } from './reply-generator/reply-generator.module';
import { IntentsInterpreterModule } from './intents-interpreter/intents-interpreter.module';
import { DataPopulatorModule } from './internal/data-populator/data-populator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'prd'
          ? 'src/config/.prd.env'
          : 'src/config/.dev.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URI, {
      dbName: process.env.MONGODB_NAME,
    }),
    ReplyGeneratorModule,
    IntentsInterpreterModule,
    DataPopulatorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
