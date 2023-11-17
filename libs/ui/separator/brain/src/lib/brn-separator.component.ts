import { booleanAttribute, Component, Input } from '@angular/core';

export type BrnSeparatorOrientation = 'horizontal' | 'vertical';
@Component({
	selector: 'brn-separator',
	standalone: true,
	template: '',
	host: {
		'[role]': '_decorative ? "none" : "separator"',
		'[attr.aria-orientation]': '_decorative ? undefined : _orientation === "vertical" ? "vertical" : undefined ',
		'[attr.data-orientation]': '_orientation',
	},
})
export class BrnSeparatorComponent {
	protected _orientation: BrnSeparatorOrientation = 'horizontal';
	@Input()
	set orientation(value: BrnSeparatorOrientation) {
		this._orientation = value;
	}

	protected _decorative = false;
	@Input({ transform: booleanAttribute })
	set decorative(value: boolean) {
		this._decorative = value;
	}
}
