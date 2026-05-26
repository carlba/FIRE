import { fileURLToPath } from 'url';
import { config, LOGGER } from './registry.js';
import { createServer } from './server.js';

const logger = LOGGER.child({ module: 'index' });

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const server = await createServer();
  await server.listen({ port: config.PORT, host: '0.0.0.0' });
  logger.info(`Server lyssnar på port ${config.PORT}`);
}
