import { Component, inject } from '@angular/core';
import { BrnToasterComponent } from './brain/src';
import { BrnToasterService } from './brain/src/lib/brn-toaster.service';
import { HlmToasterComponent } from './helm/src';

@Component({
	selector: 'hlm-toaster-demo',
	standalone: true,
	imports: [HlmToasterComponent, BrnToasterComponent],
	template: `
		<button (click)="addToast()">Add toast</button>
		<hlm-toaster />
		<!-- <brn-toaster /> -->
	`,
})
export class HlmToasterDemoComponent {
	toasterService = inject(BrnToasterService);

	addToast() {
		this.toasterService.message('This is the title', {
			description: 'This is the description',
			position: 'bottom-right',
			cancel: {
				label: 'Undo',
				onClick: () => {},
			},
		});
	}
}
