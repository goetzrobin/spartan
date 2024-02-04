import { computed, Directive, effect, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-table[hlm], [brnTable] [hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		role: 'table',
		'[attr.aria-labelledby]': 'labeledBy()',
	},
})
export class HlmTableDirective {
	private readonly class = input<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col text-sm [&_hlm-trow:last-child]:border-0', this.class()),
	);

	// we aria-labelledby to be settable from outside but use the input by default.
	private readonly _labeledByInput = input<string | null | undefined>(undefined, { alias: 'aria-labelledby' });
	public readonly labeledBy = signal<string | null | undefined>(undefined);

	constructor() {
		effect(() => this.labeledBy.set(this._labeledByInput()), { allowSignalWrites: true });
	}
}
