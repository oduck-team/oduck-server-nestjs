import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setSwagger } from './global/config/swagger';
import { winstonLogger } from './global/config/winston';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  // swagger 적용
  setSwagger(app);

  // helmet 헤더 보안 적용
  app.use(helmet());

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 600000, // 임시 10분
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // 포트 설정후 실행
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}

bootstrap();
