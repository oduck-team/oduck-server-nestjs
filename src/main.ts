import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './global/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger 적용
  setSwagger(app);

  await app.listen(3000);
}

bootstrap();
