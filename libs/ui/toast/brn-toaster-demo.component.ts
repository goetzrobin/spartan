import { Component, inject } from '@angular/core';
import { BrnToasterComponent } from './brain/src';
import { BrnToasterService } from './brain/src/lib/brn-toaster.service';

@Component({
	selector: 'brn-toaster-demo',
	standalone: true,
	imports: [BrnToasterComponent],
	template: `
		<button (click)="addToast()">Add toast</button>
		<brn-toaster />
	`,
})
export class BrnToasterDemoComponent {
	toasterService = inject(BrnToasterService);

	addToast() {
		this.toasterService.message('This is a test message.', {
			description: 'Plus description..',
		});
	}
}
