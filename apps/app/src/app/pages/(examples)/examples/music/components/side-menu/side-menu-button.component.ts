import { Component } from '@angular/core';

@Component({
	selector: 'music-side-button',
	standalone: true,
	host: {
		class: 'block',
	},
	providers: [],
	template: `
		<button
			class="hover:bg-secondary/80 focus-visible:ring-ring inline-flex h-9 w-full items-center justify-start rounded px-4 py-2 text-left text-sm transition-colors focus-visible:right-1 focus:focus-visible:outline-none"
		>
			<ng-content></ng-content>
		</button>
	`,
})
export class SideMenuButtonComponent {}
