import { INestiaConfig } from '@nestia/sdk';
import { controllerFilePaths } from './src/global/utils/controllerPathfinder.util';

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
        url: 'http://localhost:8000/api',
        description: 'Local Server',
      },
    ],
  },
};

export default config;
