import { Component, Input } from '@angular/core';
import { SpartanLogoComponent } from '@spartan-ng/app/app/shared/spartan-logo.component';

@Component({
	selector: 'spartan-th-item',
	standalone: true,
	imports: [SpartanLogoComponent],
	host: {
		class: 'inline-flex flex-col justify-center items-center',
	},
	template: `
		<a class="flex flex-col items-center" [href]="href" target="_blank">
			<spartan-logo class="bg-primary h-9 w-9 -rotate-90 rounded-full p-1" />
			<span class="mt-1 inline-block whitespace-nowrap text-[.7rem] font-medium hover:underline">
				<ng-content />
			</span>
		</a>
	`,
})
export class ThreeHundredItemComponent {
	@Input()
	href = '';
}
