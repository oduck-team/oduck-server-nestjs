import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './global/config/swagger';
import { winstonLogger } from './global/config/winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  // swagger 적용
  setSwagger(app);

  // 포트 설정후 실행
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}

bootstrap();
