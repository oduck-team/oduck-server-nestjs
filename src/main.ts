import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';

export const setSwagger = (app: INestApplication) => {
  const swaagerConfig = readFileSync(
    path.join(__dirname, '../swagger.json'),
    'utf8',
  );
  const swaggerDocument = JSON.parse(swaagerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setSwagger(app);
  await app.listen(3000);
}
bootstrap();
