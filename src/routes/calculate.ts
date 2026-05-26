import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { calculateProjection } from '../calculator.js';

const pensionIntervalSchema = z.object({
  fromAge: z.number().int().nonnegative(),
  toAge: z.number().int().positive().nullable(),
  monthlyAmount: z.number().nonnegative(),
});

const calculateRequestSchema = z.object({
  currentAge: z.number().int().min(0).max(89),
  monthlyIncome: z.number().nonnegative(),
  startingCapital: z.number().nonnegative(),
  annualReturnRate: z.number().min(0).max(100),
  monthlySavings: z.number().nonnegative().optional(),
  pensionIntervals: z.array(pensionIntervalSchema),
});

const yearProjectionSchema = z.object({
  age: z.number(),
  capital: z.number(),
  monthlySalary: z.number(),
  monthlyPension: z.number(),
  monthlyPassiveIncome: z.number(),
  totalMonthlyIncome: z.number(),
});

const calculateResponseSchema = z.object({
  projections: z.array(yearProjectionSchema),
});

export const calculateRoute: FastifyPluginAsyncZod = server => {
  server.post('/calculate', {
    schema: {
      body: calculateRequestSchema,
      response: { 200: calculateResponseSchema },
    },
    handler: async (request, reply) => {
      const projections = calculateProjection(request.body);
      return reply.send({ projections });
    },
  });
  return Promise.resolve();
};
