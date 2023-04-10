import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const noteRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    ).mutation(({ input }) => prisma.note.create({data: {
      note: input.title
      }})),
  list: publicProcedure.query( () =>   prisma.note.findMany()
  ),
  remove: publicProcedure
  .input(z.object({
    id: z.bigint()
  })).mutation(({input}) => prisma.note.delete({
      where: {
        id: input.id
      }
    }))
});
