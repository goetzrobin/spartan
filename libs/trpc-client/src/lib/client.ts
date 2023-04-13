/**
 * Inspired by this awesome project to integrate trpc more into the angular way
 * of doing things https://github.com/Dafnik/ngx-trpc
 */
import { inject, InjectionToken, Provider } from '@angular/core';
import 'isomorphic-fetch';
import superjson from 'superjson';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AnyRouter } from '@trpc/server';

export type TrpcOptions = Partial<{
  url: string;
}>;

export type TrpcClient<AppRouter extends AnyRouter> = ReturnType<typeof createTRPCProxyClient<AppRouter>>;

const TRPC_PROVIDER = new InjectionToken<unknown>('___TRPC_PROVIDER___');
export const createTrpcClient = <AppRouter extends AnyRouter>({ url }: TrpcOptions) => {
  const provideTRPCClient = (): Provider => ({
    provide: TRPC_PROVIDER,
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
  const TYPED_TRPC_PROVIDER = TRPC_PROVIDER as InjectionToken<TrpcClient<AppRouter>>;
  const injectTRPCClient = (): TrpcClient<AppRouter> => inject(TYPED_TRPC_PROVIDER);

  return {
    TRPC_PROVIDER: TYPED_TRPC_PROVIDER as InjectionToken<TrpcClient<AppRouter>>,
    provideTRPCClient,
    injectTRPCClient
  };
};
