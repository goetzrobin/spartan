import { Component, Input } from '@angular/core';
import { hlmLead } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-section-intro',
	standalone: true,
	host: {
		class: 'mb-8 block space-y-2',
	},
	template: `
		<h1 class="text-4xl font-bold tracking-tight scroll-m-20">{{ name }}</h1>
		<p class="${hlmLead}">{{ lead }}</p>
	`,
})
export class SectionIntroComponent {
	@Input()
	name = '';
	@Input()
	lead = '';
}
