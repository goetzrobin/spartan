import { appRouter } from '../../trpc/routers';
import { createContext } from '../../trpc/context';
import { createTrpcNitroHandler } from "@nx-analog-test/trpc";
// export API handler
export default createTrpcNitroHandler({
  router: appRouter,
  createContext,
});
