import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const env = process.env.NODE_ENV;
const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = new Date().toLocaleString('ko-KR', { timeZone: opts.tz });
  }
  return info;
});

const logDir = process.cwd() + '/logs'; // log 파일을 관리할 폴더.

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장.
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리.
  };
};

export const winstonLogger = WinstonModule.createLogger({
  // 콘솔 출력 옵션
  transports: [
    new winston.transports.Console({
      // prod 환경이면 info 레벨까지 출력.
      // dev 환경이면 debug 레벨까지 출력.
      level: env === 'prod' ? 'http' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.json(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[oDuck.io] ${timestamp} - ${level}\t [${process.pid}] : ${message}`;
        }),
      ),
    }),

    // 로그를 저장할 레벨로 error, warn, info 지정.
    new winstonDaily(dailyOptions('error')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('info')),
  ],
});
