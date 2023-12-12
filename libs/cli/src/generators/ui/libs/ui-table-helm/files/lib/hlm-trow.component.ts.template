import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	Input,
	signal,
	ViewEncapsulation,
} from '@angular/core';
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
	@Input({ transform: booleanAttribute })
	public truncate = false;

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'flex flex border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
			this._userCls(),
		);
	}
}
