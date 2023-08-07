import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';

// swagger 문서 api.
export const setSwagger = (app: INestApplication) => {
  // 경로 및 글자 포맷 지정.
  const swaagerConfig = readFileSync(
    path.join(process.cwd(), '/dist/swagger.json'),
    'utf8',
  );
  const swaggerDocument = JSON.parse(swaagerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);
};
