import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReplyGeneratorModule } from '../src/reply-generator/reply-generator.module';
import { IntentsInterpreterModule } from '../src/intents-interpreter/intents-interpreter.module';
import { DataPopulatorModule } from '../src/internal/data-populator/data-populator.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './src/config/.dev.env',
        }),
        MongooseModule.forRoot(mongoUri, {
          dbName: process.env.MONGODB_NAME,
        }),
        ReplyGeneratorModule,
        IntentsInterpreterModule,
        DataPopulatorModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    mongoConnection = moduleFixture.get(getConnectionToken());
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
    await app.close();
  });

  it('/api/v1/reply (GET)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/reply')
      .send({
        message: 'Hello',
        botId: process.env.BOT_ID,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        // Gets default response as the DB is empty
        intent: 'unknown intent',
        confidence: 1,
        reply: 'I didnt get you. Could you please rephrase and ask again?',
      });
  });

  it('should return 400 error when date is missing', () => {
    return request(app.getHttpServer())
      .post('/api/v1/reply')
      .send({
        message: 'Hello',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect({
        message: [
          'botId is not valid',
          'botId should not be empty',
          'botId must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
