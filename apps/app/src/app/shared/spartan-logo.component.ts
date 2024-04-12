import { Component, Input } from '@angular/core';

@Component({
	selector: 'spartan-logo',
	standalone: true,
	host: {
		'(click)': 'openHref()',
		class: 'flex items-center justify-center hover:cursor-pointer',
	},
	template: `
		<svg class="w-full" viewBox="0 0 630 268" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M191.5 244.5L560 135L191.5 23.5L126.5 98.5L69.5 62L24 137.5L64.5 211L131 174.5L191.5 244.5Z"
				fill="#DD0031"
			/>
			<path
				d="M562.848 144.586L594.816 135.087L562.896 125.429L194.396 13.9285L188.19 12.0506L183.943 16.9507L124.586 85.4401L74.3593 53.5573L65.7181 48.0721L60.4351 56.8383L14.9351 132.338L11.9592 137.276L14.7416 142.326L55.2416 215.826L60.0445 224.542L68.7839 219.781L128.705 187.138L183.934 251.039L188.157 255.925L194.348 254.086L562.848 144.586Z"
				stroke="#36000D"
				stroke-width="20"
			/>
			<path d="M23.5 137.5L64 211L131 174.5L191.5 244.5L560.891 135L23.5 137.5Z" fill="#75011D" />
			<path
				d="M260.533 136L260.533 170.86L199 187.374L199 218L474 136.141L473.527 136L384.145 136L384.651 136.141L298.463 160.134L298.463 136L260.533 136Z"
				fill="#DD0031"
			/>
			<path
				d="M260.533 136L260.533 101.14L199 84.6265L199 54L474 135.859L473.527 136L384.145 136L384.651 135.859L298.463 111.866L298.463 136L260.533 136Z"
				fill="#75011D"
			/>
		</svg>
	`,
})
export class SpartanLogoComponent {
	@Input()
	href = '';

	private openHref() {
		if (this.href != '') {
			window.open(this.href, '_blank');
		}
	}
}
