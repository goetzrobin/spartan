import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-trow',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		role: 'row',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmTrowComponent {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'flex flex border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
			this._userClass(),
		),
	);
}
