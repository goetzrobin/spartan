import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';

@Component({
	selector: 'spartan-root',
	imports: [RouterOutlet, Header, Footer],
	host: {
		class: 'bg-background relative z-10 flex min-h-svh flex-col',
	},
	template: `
		@if (!_isTestPage()) {
			<svg class="pointer-events-none fixed inset-0 z-40 h-full w-full" aria-hidden="true">
				<defs>
					<radialGradient id="spartan-spotlight" cx="0.5502" cy="0.3146" r="0.686">
						<stop offset="0" stop-color="#d9d9d9" stop-opacity="0.078" />
						<stop offset="0.5" stop-color="#8c8c8c" stop-opacity="0.02" />
						<stop offset="0.8" stop-color="#737373" stop-opacity="0" />
					</radialGradient>
				</defs>
				<g transform="translate(0 -350) rotate(-45 280 690)">
					<rect x="0" y="0" width="560" height="1380" fill="url(#spartan-spotlight)" />
				</g>
			</svg>
			<spartan-header id="spartan-header" />
		}
		<main class="flex flex-1 flex-col" id="spartan-main">
			<router-outlet />
		</main>
		@if (!_isTestPage()) {
			<spartan-footer id="spartan-footer" />
		}
	`,
})
export class App {
	private readonly _router = inject(Router);

	/**
	 * Pages under `/test` are what the Playwright suite runs against. They render without the
	 * header, footer and background decoration so a test only ever meets the case it is testing: the first Tab lands in
	 * the case, accessibility checks see nothing else, and nothing the header loads (search,
	 * GitHub stars) can fail or slow a test down.
	 */
	protected readonly _isTestPage = toSignal(
		this._router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => isTestPath(event.urlAfterRedirects)),
		),
		{ initialValue: isTestPath(inject(Location).path()) },
	);
}

function isTestPath(url: string): boolean {
	return url === '/test' || url.startsWith('/test/') || url.startsWith('/test?');
}
