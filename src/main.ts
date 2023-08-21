import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setSwagger } from './global/config/swagger';
import { winstonLogger } from './global/config/winston';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // helmet 헤더 보안 적용
  app.use(helmet());

  app.setGlobalPrefix('api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '20230821',
    prefix: 'v',
  });

  // swagger 적용
  setSwagger(app);

  // 포트 설정후 실행
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}

bootstrap().then(() => {
  console.log(process.env.PORT);
});
