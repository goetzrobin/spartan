import {
	Component,
	EventEmitter,
	Input,
	Output,
	booleanAttribute,
	computed,
	forwardRef,
	input,
	signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@spartan-ng/ui-switch-brain';
import type { ClassValue } from 'clsx';
import { HlmSwitchThumbDirective } from './hlm-switch-thumb.directive';

export const HLM_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmSwitchComponent),
	multi: true,
};

@Component({
	selector: 'hlm-switch',
	imports: [BrnSwitchThumbComponent, BrnSwitchComponent, HlmSwitchThumbDirective],
	standalone: true,
	host: {
		class: 'contents',
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	template: `
		<brn-switch
			[class]="_computedClass()"
			[checked]="_checked()"
			(changed)="_handleChange($event)"
			(touched)="_onTouched()"
			[disabled]="_disabled()"
			[id]="id"
			[aria-label]="ariaLabel"
			[aria-labelledby]="ariaLabelledby"
			[aria-describedby]="ariaDescribedby"
		>
			<brn-switch-thumb hlm />
		</brn-switch>
	`,
	providers: [HLM_SWITCH_VALUE_ACCESSOR],
})
export class HlmSwitchComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'group inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
			this._disabled() ? 'cursor-not-allowed opacity-50' : '',
			this.userClass(),
		),
	);

	@Output()
	public changed = new EventEmitter<boolean>();

	protected _handleChange(value: boolean): void {
		this._checked.set(value);
		this._onChange(value);
		this.changed.emit(value);
	}

	protected _checked = signal(false);
	@Input({ transform: booleanAttribute })
	set checked(value: boolean) {
		this._checked.set(value);
	}

	protected readonly _disabled = signal(false);
	@Input({ transform: booleanAttribute })
	set disabled(value: boolean) {
		this._disabled.set(value);
	}

	/** Used to set the id on the underlying brn element. */
	@Input()
	id: string | null = null;

	/** Used to set the aria-label attribute on the underlying brn element. */
	@Input('aria-label')
	ariaLabel: string | null = null;

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	@Input('aria-labelledby')
	ariaLabelledby: string | null = null;

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	@Input('aria-describedby')
	ariaDescribedby: string | null = null;

	/** CONROL VALUE ACCESSOR */

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	writeValue(value: any): void {
		this.checked = !!value;
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars,,@typescript-eslint/no-explicit-any
	protected _onChange = (_: any) => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onTouched = () => {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}
}
