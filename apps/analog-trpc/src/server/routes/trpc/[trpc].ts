import { appRouter } from '../../trpc/routers';
import { createContext } from '../../trpc/context';
import { createTrpcNitroHandler } from "../../../libs/trpc/server";
// export API handler
export default createTrpcNitroHandler({
  router: appRouter,
  createContext,
});
