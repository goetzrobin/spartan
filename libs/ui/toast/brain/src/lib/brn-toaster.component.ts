import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'brn-toaster',
	standalone: true,
	imports: [CommonModule],
	template: `
		<p>brain works!</p>
	`,
	styles: [],
})
export class BrnToasterComponent {}
