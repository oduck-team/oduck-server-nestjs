import { INestiaConfig } from '@nestia/sdk';
import { controllerFilePaths } from './src/global/utils/controllerPathfinder.util';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

// nestia(swagger 자동 문서화, sdk 자동 생성) 설정
const config: INestiaConfig = {
  // controller 위치
  input: controllerFilePaths,
  // 문서 생성 위치
  swagger: {
    output: 'dist/swagger.json',
    // 인증 방식
    security: {
      apiCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
      },
    },
    // 서버 정보
    servers: [
      {
        url: `http://localhost:8000/api/v20230821`,
        description: 'Local Server',
      },
      {
        url: `http://localhost:${process.env.PORT}/api/v20230821`,
        description: 'Local Server no docker',
      },
    ],
  },
};

export default config;
