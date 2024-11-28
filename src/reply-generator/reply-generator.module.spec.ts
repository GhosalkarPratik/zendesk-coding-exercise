import { Test, TestingModule } from '@nestjs/testing';
import { ReplyGeneratorService } from './reply-generator.service';
import { ReplyGeneratorController } from './reply-generator.controller';
import { IntentsInterpreterModule } from '../intents-interpreter/intents-interpreter.module';
import { ReplyGeneratorModule } from './reply-generator.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as process from 'node:process';

describe('ReplyGeneratorModule', () => {
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  const DEFAULT_REPLY = { reply: 'Sorry, I didn’t understand that.' };

  beforeAll(async () => {
    process.env.STRINGIFIED_DEFAULT_REPLY = JSON.stringify(DEFAULT_REPLY);
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    module = await Test.createTestingModule({
      imports: [
        ReplyGeneratorModule,
        MongooseModule.forRoot(mongoUri, {
          dbName: process.env.MONGODB_NAME,
        }),
      ],
    }).compile();
    mongoConnection = module.get(getConnectionToken());
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
    await module.close();
  });

  it('should initialize the ReplyGeneratorModule', () => {
    const appModule = module.get(ReplyGeneratorModule);
    expect(appModule).toBeDefined();
  });

  it('should have ReplyGeneratorService as a provider', () => {
    const service = module.get<ReplyGeneratorService>(ReplyGeneratorService);
    expect(service).toBeDefined();
  });

  it('should have ReplyGeneratorController as a controller', () => {
    const controller = module.get<ReplyGeneratorController>(
      ReplyGeneratorController,
    );
    expect(controller).toBeDefined();
  });

  it('should import the IntentsInterpreterModule', () => {
    const importedModules = module.get<IntentsInterpreterModule>(
      IntentsInterpreterModule,
    );
    expect(importedModules).toBeDefined();
  });
});
