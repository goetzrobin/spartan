import {
	ChangeDetectorRef,
	Directive,
	EventEmitter,
	Input,
	Output,
	booleanAttribute,
	computed,
	inject,
	signal,
} from '@angular/core';
import { ToggleGroupCanBeNullableProvider } from './toggle-group-can-be-nullable-provider';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'button[hlmToggle], button[brnToggle]',
	standalone: true,
	host: {
		'[attr.disabled]': 'toggleDisabled()',
		'[attr.data-disabled]': 'toggleDisabled()',
		'[attr.data-state]': 'state()',
		'[attr.aria-pressed]': 'isOn()',
		'(click)': 'toggle()',
	},
})
export class BrnToggleDirective {
	private static uniqueId = 0;
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _tgCanBeNullableProvider = inject(ToggleGroupCanBeNullableProvider, { optional: true });

	private readonly _disabled = signal<true | undefined>(undefined);
	private readonly _state = signal<'on' | 'off'>('off', { equal: (a, b) => a === b });

	public readonly state = this._state.asReadonly();
	public readonly toggleDisabled = this._disabled.asReadonly();
	public readonly isOn = computed(() => this.state() === 'on');

	@Input()
	public id = `brn-toggle-${BrnToggleDirective.uniqueId++}`;

	@Input()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public value: any;

	@Input({ transform: booleanAttribute })
	set disabled(value: boolean) {
		this._disabled.set(value ? true : undefined);
	}

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('state')
	set setState(value: 'on' | 'off') {
		this._state.set(value);
	}

	private _disableToggleClick = false;
	@Input({ transform: booleanAttribute })
	set disableToggleClick(value: boolean) {
		this._disableToggleClick = value;
	}

	@Output()
	public readonly toggled = new EventEmitter<'on' | 'off'>();

	toggle() {
		if (this._disableToggleClick) return;
		if (this._state() === 'on') {
			this.toggleOff();
		} else {
			this.toggleOn();
		}
	}

	toggleOff() {
		if (this._tgCanBeNullableProvider && !this._tgCanBeNullableProvider._canBeNullable(this.value)) return;
		this._state.set('off');
		this.toggled.emit('off');
	}

	toggleOn() {
		this._state.set('on');
		this.toggled.emit('on');
	}

	public _markForCheck() {
		this._cdr.markForCheck();
	}
}
