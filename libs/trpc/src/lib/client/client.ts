import { InjectionToken, type Provider, TransferState, signal } from '@angular/core';
import { type CreateTRPCClientOptions, type HTTPHeaders, type HttpBatchLinkOptions, httpBatchLink } from '@trpc/client';
import type { FetchEsque } from '@trpc/client/dist/internals/types';
import type { AnyRouter } from '@trpc/server';
import 'isomorphic-fetch';
import { provideTrpcCacheState, provideTrpcCacheStateStatusManager, tRPC_CACHE_STATE } from './cache-state';
import { transferStateLink } from './links/transfer-state-link';
import { createTRPCRxJSProxyClient } from './trpc-rxjs-proxy';

export type TrpcOptions<T extends AnyRouter> = {
	url: string;
	options?: Partial<CreateTRPCClientOptions<T>>;
	batchLinkOptions?: Omit<HttpBatchLinkOptions, 'url' | 'headers'>;
};

export type TrpcClient<AppRouter extends AnyRouter> = ReturnType<typeof createTRPCRxJSProxyClient<AppRouter>>;
const tRPC_INJECTION_TOKEN = new InjectionToken<unknown>('@spartan-ng/trpc proxy client');

function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' }) {
	if ((globalThis as any).$fetch) {
		return (globalThis as any).$fetch
			.raw(input.toString(), init)
			.catch((e: any) => {
				throw e;
			})
			.then((response: any) => ({
				...response,
				headers: response.headers,
				json: () => Promise.resolve(response._data),
			}));
	}

	// dev server trpc for analog & nitro
	if (typeof window === 'undefined') {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const host = process.env['NITRO_HOST'] ?? process.env['ANALOG_HOST'] ?? 'localhost';
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const port = process.env['NITRO_PORT'] ?? process.env['ANALOG_PORT'] ?? 4205;
		const base = `http://${host}:${port}`;
		if (input instanceof Request) {
			input = new Request(base, input);
		} else {
			input = new URL(input, base);
		}
	}

	return fetch(input, init);
}

export const createTrpcClient = <AppRouter extends AnyRouter>({
	url,
	options,
	batchLinkOptions,
}: TrpcOptions<AppRouter>) => {
	const TrpcHeaders = signal<HTTPHeaders>({});
	const provideTrpcClient = (): Provider[] => [
		provideTrpcCacheState(),
		provideTrpcCacheStateStatusManager(),
		{
			provide: tRPC_INJECTION_TOKEN,
			useFactory: () => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore TODO: figure out why TS is complaining
				return createTRPCRxJSProxyClient<AppRouter>({
					transformer: options?.transformer,
					links: [
						...(options?.links ?? []),
						transferStateLink(),
						httpBatchLink({
							// eslint-disable-next-line
							...(batchLinkOptions ?? {}),
							headers() {
								return TrpcHeaders();
							},
							fetch: customFetch as FetchEsque,
							url: url ?? '',
						}),
					],
				});
			},
			deps: [tRPC_CACHE_STATE, TransferState],
		},
	];
	const TrpcClient = tRPC_INJECTION_TOKEN as InjectionToken<TrpcClient<AppRouter>>;
	return {
		TrpcClient,
		provideTrpcClient,
		TrpcHeaders,
		/** @deprecated use TrpcClient instead */
		tRPCClient: TrpcClient,
		/** @deprecated use provideTrpcClient instead */
		provideTRPCClient: provideTrpcClient,
		/** @deprecated use TrpcHeaders instead */
		tRPCHeaders: TrpcHeaders,
	};
};

export default createTrpcClient;
