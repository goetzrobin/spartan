import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardDirective } from '@spartan-ng/ui-card-helm';
import { metaWith } from '~/app/shared/meta/meta.util';
import { AuthenticationFormComponent } from './components/form.component';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Authentication', 'An authenticaton example using spartan UI primitive'),
	title: 'spartan/examples - Authentication',
};

@Component({
	selector: 'spartan-authentication',
	standalone: true,
	imports: [AuthenticationFormComponent, HlmButtonDirective, HlmCardDirective],
	host: {
		class: 'block',
	},
	template: `
		<div hmlcard class="bg-background overflow-hidden shadow-md md:shadow-xl">
			<div class="md:hidden">
				<img
					alt="Authentication example page"
					loading="lazy"
					width="1280"
					height="843"
					decoding="async"
					data-nimg="1"
					class="block text-transparent dark:hidden"
					src="/assets/auth_example_light_mobile.png"
				/>
				<img
					alt="Authentication example page"
					loading="lazy"
					width="1280"
					height="843"
					decoding="async"
					data-nimg="1"
					class="hidden text-transparent dark:block"
					src="/assets/auth_example_dark_mobile.png"
				/>
			</div>
			<div
				class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
			>
				<a
					hlmBtn
					variant="link"
					class="focus-visible:ring-ring hover:bg-accent absolute right-4 top-4 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium  transition-colors hover:no-underline focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 md:right-8 md:top-8"
					href="/examples/authentication"
				>
					Login
				</a>

				<div class="bg-muted relative hidden h-full flex-col border-r p-10 text-white lg:flex dark:border-r-zinc-800">
					<div class="absolute inset-0 bg-zinc-900"></div>
					<div class="relative z-20 flex items-center text-lg font-medium">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-6 w-6"
						>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
						</svg>
						Acme Inc
					</div>
					<div class="relative z-20 mt-auto">
						<blockquote class="space-y-2">
							<p class="text-lg">
								“This library has saved me countless hours of work and helped me deliver stunning designs to my clients
								faster than ever before.”
							</p>
							<footer class="text-sm">Sofia Davis</footer>
						</blockquote>
					</div>
				</div>
				<div class="lg:p-8">
					<auth-example-form />
				</div>
			</div>
		</div>
	`,
})
export default class TypographyPageComponent {}
