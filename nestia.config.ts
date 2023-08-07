import { INestiaConfig } from '@nestia/sdk';
import { controllerFilePaths } from './src/global/utils/controllerPathfinder.util';
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.dev' })

const config: INestiaConfig = {
  input: controllerFilePaths,
  swagger: {
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.NO_DOCKER ? process.env.PORT : 8000}`,
        description: 'Local Server',
      },
    ],
  },
};

export default config;
