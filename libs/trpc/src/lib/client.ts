/**
 * Inspired by this awesome project to integrate trpc more into the angular way
 * of doing things https://github.com/Dafnik/ngx-trpc
 */
import { InjectionToken, Provider } from '@angular/core';
import 'isomorphic-fetch';
import superjson from 'superjson';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AnyRouter } from '@trpc/server';

export type TrpcOptions = Partial<{
  url: string;
}>;

export type TrpcClient<AppRouter extends AnyRouter> = ReturnType<typeof createTRPCProxyClient<AppRouter>>;

const tRPC_INJECTION_TOKEN = new InjectionToken<unknown>('@spartan/trpc proxy client');
export const createTrpcClient = <AppRouter extends AnyRouter>({ url }: TrpcOptions) => {
  const provideTRPCClient = (): Provider => ({
    provide: tRPC_INJECTION_TOKEN,
    useFactory: () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO: figure out why TS is complaining
      createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: url ?? ''
          })
        ]
      })
  });
  return {
    tRPCClient: tRPC_INJECTION_TOKEN as InjectionToken<TrpcClient<AppRouter>>,
    provideTRPCClient
  };
};
