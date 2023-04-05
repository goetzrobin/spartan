import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

const posts: string[] = ['hi'];

export const postRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    ).mutation(({ input }) => posts.push(input.title)),
  list: publicProcedure.query(() => {
    return posts;
  }),
  remove: publicProcedure
  .input(z.object({
    id: z.number()
  })).mutation(({input}) => posts.splice(input.id, 1))
});