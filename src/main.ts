import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setSwagger } from './global/config/swagger';
import { winstonLogger } from './global/config/winston';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { redisClient } from './global/libs/redis';
import { Logger } from '@nestjs/common';

const TTL = 60 * 60 * 24 * 14; // 14일

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  const redisStore = new RedisStore({
    client: redisClient,
    ttl: process.env.SESSION_TTL ? parseInt(process.env.SESSION_TTL) : TTL,
  });

  // swagger 적용
  setSwagger(app);

  // helmet 헤더 보안 적용
  app.use(helmet());

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: process.env.SESSION_TTL
          ? parseInt(process.env.SESSION_TTL) * 1000
          : TTL * 1000, // 임시 10분
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // 포트 설정후 실행
  await app
    .listen(process.env.PORT ? parseInt(process.env.PORT) : 3000)
    .then(() => {
      Logger.log(
        `Server listening on... ${
          process.env.PORT ? parseInt(process.env.PORT) : 3000
        } port`,
      );
    });
}

bootstrap();
