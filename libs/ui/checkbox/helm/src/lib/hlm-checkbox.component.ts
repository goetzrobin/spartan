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
import { BrnCheckboxComponent, indeterminateBooleanAttribute } from '@spartan-ng/ui-checkbox-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { HlmCheckboxCheckIconComponent } from './hlm-checkbox-checkicon.component';

export const HLM_CHECKBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmCheckboxComponent),
	multi: true,
};

@Component({
	selector: 'hlm-checkbox',
	standalone: true,
	imports: [BrnCheckboxComponent, HlmCheckboxCheckIconComponent],
	template: `
		<brn-checkbox
			[id]="id()"
			[name]="name()"
			[class]="_computedClass()"
			[checked]="_checked()"
			[disabled]="disabled()"
			[required]="required()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
			(changed)="_handleChange()"
			(touched)="_onTouched()"
		>
			<hlm-checkbox-checkicon [class]="checkIconClass()" [iconName]="checkIconName()" />
		</brn-checkbox>
	`,
	host: {
		class: 'contents',
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	providers: [HLM_CHECKBOX_VALUE_ACCESSOR],
})
export class HlmCheckboxComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'group inline-flex border border-foreground shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' +
				' focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:text-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-background',
			this.userClass(),
			this.disabled() ? 'cursor-not-allowed opacity-50' : '',
		),
	);

	/** Used to set the id on the underlying brn element. */
	public readonly id = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying brn element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	public readonly name = input<string | null>(null);
	public readonly disabled = input(false, { transform: booleanAttribute });
	public readonly required = input(false, { transform: booleanAttribute });

	// icon inputs
	public readonly checkIconName = input<string>('lucideCheck');
	public readonly checkIconClass = input<string>('');

	@Output()
	public changed = new EventEmitter<boolean>();

	protected _handleChange(): void {
		if (this.disabled()) return;

		const previousChecked = this._checked();
		this._checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
		this._onChange(!previousChecked);
		this.changed.emit(!previousChecked);
	}

	// TODO should be changed to new model input when updated to Angular 17.2
	protected _checked = signal<boolean | 'indeterminate'>(false);
	@Input({ transform: indeterminateBooleanAttribute })
	set checked(value: boolean | 'indeterminate') {
		this._checked.set(value);
	}

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
