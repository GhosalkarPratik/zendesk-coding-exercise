import { IsNotEmpty, IsString, registerDecorator } from 'class-validator';
import * as process from 'node:process';

function IsValidBotId() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidBotId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'botId is not valid',
      },
      validator: {
        validate(value: string) {
          return value === process.env.BOT_ID;
        },
      },
    });
  };
}

export class InputQuery {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsValidBotId()
  botId: string;
}
