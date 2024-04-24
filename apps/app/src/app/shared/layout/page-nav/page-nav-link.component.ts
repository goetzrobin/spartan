import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'spartan-page-nav-link',
	standalone: true,
	imports: [RouterLink, RouterLinkActive],
	host: {
		class: 'mt-0 pt-2',
		role: 'listitem',
	},
	template: `
		<a
			[routerLink]="[]"
			[relativeTo]="activatedRoute"
			[fragment]="fragment"
			class="inline-block no-underline rounded hover:text-foreground text-muted-foreground focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2"
		>
			{{ label }}
		</a>
	`,
})
export class PageNavLinkComponent {
	protected activatedRoute = inject(ActivatedRoute);
	@Input()
	fragment = '';
	@Input()
	label = '';
}
