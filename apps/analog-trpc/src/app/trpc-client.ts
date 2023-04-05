import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import 'isomorphic-fetch';
import { AppRouter } from '../server/trpc/routers';
import { InjectionToken } from "@angular/core";

// watch cors here
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://127.0.0.1:4200/api/trpc',
    }),
  ],
});
export const TrpcClient = new InjectionToken<typeof client>(
  '@analogjs/trpc trpc client',
  {
    providedIn: 'root',
    factory: () => client,
  }
);
