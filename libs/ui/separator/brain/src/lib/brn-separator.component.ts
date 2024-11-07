import { Component, booleanAttribute, computed, input } from '@angular/core';

export type BrnSeparatorOrientation = 'horizontal' | 'vertical';

@Component({
	selector: 'brn-separator',
	standalone: true,
	template: '',
	host: {
		'[role]': 'role()',
		'[attr.aria-orientation]': 'ariaOrientation()',
		'[attr.data-orientation]': 'dataOrientation()',
	},
})
export class BrnSeparatorComponent {
	public readonly dataOrientation = input<BrnSeparatorOrientation>('horizontal', { alias: 'orientation' });
	public readonly decorative = input(false, { transform: booleanAttribute });

	protected readonly role = computed(() => (this.decorative() ? 'none' : 'separator'));
	protected readonly ariaOrientation = computed(() =>
		this.decorative() ? undefined : this.dataOrientation() === 'vertical' ? 'vertical' : undefined,
	);
}
