import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
	computed,
	effect,
	input,
	viewChild,
} from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-content',
	template: `
        <brn-accordion-content [class]="_computedClass()">
            <ng-content />
        </brn-accordion-content>
    `,
	imports: [BrnAccordionContentComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmAccordionContentComponent {
	private readonly _brn = viewChild.required(BrnAccordionContentComponent);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => {
		const gridRows = this._brn().state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
		return hlm('text-sm transition-all grid', gridRows, this.userClass());
	});

	constructor() {
		effect(
			() => {
				this._brn().setClassToCustomElement('pt-1 pb-4');
			},
			{ allowSignalWrites: true },
		);
	}
}
