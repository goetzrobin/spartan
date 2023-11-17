import { Component, Input } from '@angular/core';
import { SpartanLogoComponent } from '~/app/shared/spartan-logo.component';

@Component({
	selector: 'spartan-th-item',
	standalone: true,
	imports: [SpartanLogoComponent],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<spartan-logo class="bg-primary h-9 w-9 -rotate-90 rounded-full p-1" />
		<a
			class="mt-1 inline-block whitespace-nowrap text-[.55rem] font-medium hover:underline"
			[href]="href"
			target="_blank"
		>
			<ng-content />
		</a>
	`,
})
export class ThreeHundredItemComponent {
	@Input()
	href = '';
}
