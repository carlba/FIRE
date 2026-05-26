import fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { LOGGER } from './registry.js';
import { calculateRoute } from './routes/calculate.js';

export async function createServer() {
  const server = fastify({ loggerInstance: LOGGER }).withTypeProvider<ZodTypeProvider>();

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(cors, {
    origin: true,
  });

  await server.register(calculateRoute);

  return server;
}
