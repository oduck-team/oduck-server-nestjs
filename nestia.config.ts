import { INestiaConfig } from '@nestia/sdk';
import { controllerFilePaths } from './src/global/utils/controllerPathfinder.util';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

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
