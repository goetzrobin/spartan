import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSelectOptionDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectOptionDirective],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center" [attr.data-state]="checkedState">
			@if (isChecked) {
				<span aria-hidden="true">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</span>
			}
		</span>
		<ng-content />
	`,
})
export class HlmSelectOptionComponent {
	private _brnSelectOption = inject(BrnSelectOptionDirective, { host: true });

	baseClasses =
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

	private readonly classNames = signal<ClassValue>('');

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this.classNames.set(classNames);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(this.baseClasses, this.classNames());
	}

	@Input()
	set value(value: unknown | null) {
		this._brnSelectOption.value = value;
	}

	@Input()
	set disabled(value: boolean) {
		this._disabled = value;
	}
	get disabled() {
		return this._disabled;
	}
	private _disabled = false;

	get isChecked() {
		return this._brnSelectOption.isSelected();
	}

	get checkedState() {
		return this._brnSelectOption.isSelected() ? 'checked' : 'unchecked';
	}
}
