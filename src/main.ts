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
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // swagger 적용
  setSwagger(app);

  // helmet 헤더 보안 적용
  app.use(helmet());

  // cors 설정
  app.enableCors({
    origin: process.env.NODE_ENV === 'prod' ? 'https://oduck.io/' : '*',
    credentials: true,
  });

  const redisStore = new RedisStore({
    client: redisClient,
    ttl: process.env.SESSION_TTL ? parseInt(process.env.SESSION_TTL) : TTL,
  });

  app.use(
    session({
      name: 'oDuckio.sid',
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

  app.setGlobalPrefix('api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '20230821',
    prefix: 'v',
  });

  app.use('/', (req, res, next) => {
    Logger.verbose(`Request URL: ${req.url}`);
    next();
  });

  // 포트 설정후 실행
  await app
    .listen(process.env.PORT ? parseInt(process.env.PORT) : 3000)
    .then(() => {
      Logger.log(
        `Server listening on ${
          process.env.PORT ? parseInt(process.env.PORT) : 3000
        } port`,
      );
    });
}

bootstrap();
