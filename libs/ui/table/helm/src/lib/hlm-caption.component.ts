import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Input,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { HlmTableComponent } from '../index';

let captionIdSequence = 0;

@Component({
	selector: 'hlm-caption',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[id]': '_id()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmCaptionComponent {
	private readonly _table = inject(HlmTableComponent, { optional: true });

	private readonly _hidden = signal(false);
	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-center block mt-4 text-sm text-muted-foreground',
			this._hidden() ? 'sr-only' : 'order-last',
			this._userCls(),
		),
	);
	protected readonly _id = signal<string | null | undefined>(`${captionIdSequence++}`);

	@Input({ transform: booleanAttribute })
	public truncate = false;

	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	@Input()
	set id(value: string | null | undefined) {
		this._id.set(value);
	}

	@Input({ transform: booleanAttribute })
	set hidden(value: boolean) {
		this._hidden.set(value);
	}

	constructor() {
		effect(
			() => {
				const id = this._id();
				if (!this._table) return;
				this._table.labeledBy = id;
			},
			{ allowSignalWrites: true },
		);
	}
}
