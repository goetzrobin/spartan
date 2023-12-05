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
	selector: 'hlm-table',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		role: 'table',
		'[attr.aria-labelledby]': '_labeledBy()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmTableComponent {
	@Input({ transform: booleanAttribute })
	public truncate = false;

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	protected readonly _labeledBy = signal<string | null | undefined>(undefined);
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'aria-labelledby' })
	set labeledBy(value: string | null | undefined) {
		this._labeledBy.set(value);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('flex flex-col text-sm [&_hlm-trow:last-child]:border-0', this._userCls());
	}
}
