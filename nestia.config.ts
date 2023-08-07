import { INestiaConfig } from '@nestia/sdk';
import { controllerFilePaths } from './src/global/utils/controllerPathfinder.util';

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
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local Server',
      },
    ],
  },
};

export default config;
