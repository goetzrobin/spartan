import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const noteRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(({ input }) =>
      prisma.note.create({
        data: {
          title: input.title,
          content: input.content,
        },
      })
    ),
  list: publicProcedure.query(() => prisma.note.findMany()),
  remove: publicProcedure
    .input(
      z.object({
        id: z.bigint(),
      })
    )
    .mutation(({ input }) =>
      prisma.note.delete({
        where: {
          id: input.id,
        },
      })
    ),
});
