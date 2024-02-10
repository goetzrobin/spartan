import { Component, inject } from '@angular/core';
import { BrnToasterService } from './brain/src/lib/brn-toaster.service';
import { HlmToasterComponent } from './helm/src';

@Component({
	selector: 'hlm-toaster-demo',
	standalone: true,
	imports: [HlmToasterComponent],
	template: `
		<button (click)="addToast()">Add toast</button>
		<hlm-toaster />
	`,
})
export class HlmToasterDemoComponent {
	toasterService = inject(BrnToasterService);

	addToast() {
		this.toasterService.message('This is a test message.', {
			description: 'Plus description..',
		});
	}
}
