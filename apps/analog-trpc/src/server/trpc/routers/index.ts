import { router } from "../trpc";
import {noteRouter } from './post';

export const appRouter = router({
  note: noteRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
