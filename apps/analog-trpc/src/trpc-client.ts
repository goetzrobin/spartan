import { AppRouter } from "./server/trpc/routers";
import { createTrpcClient } from "@spartan/trpc-client";

export const {provideTRPCClient, injectTRPCClient} = createTrpcClient<AppRouter>({
  url: 'http://127.0.0.1:4200/api/trpc'
})
