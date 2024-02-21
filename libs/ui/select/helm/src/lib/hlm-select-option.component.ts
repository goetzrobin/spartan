import { ChangeDetectionStrategy, Component, computed, inject, Input, signal } from '@angular/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnSelectOptionDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectOptionDirective],
	providers: [provideIcons({ radixCheck })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
		<span
			[attr.dir]="_brnSelectOption.dir()"
			class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center rtl:left-2 rtl:right-auto"
			[attr.data-state]="this._brnSelectOption.checkedState()"
		>
			@if (this._brnSelectOption.selected()) {
				<hlm-icon aria-hidden="true" name="radixCheck" />
			}
		</span>
	`,
	imports: [HlmIconComponent],
})
export class HlmSelectOptionComponent {
	protected readonly _brnSelectOption = inject(BrnSelectOptionDirective, { host: true });

	private readonly classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this.classNames.set(classNames);
	}
	protected readonly _computedClass = computed(() =>
		hlm(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2  rtl:flex-reverse rtl:pl-8 rtl:pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			this.classNames(),
		),
	);

	@Input()
	set value(value: unknown | null) {
		this._brnSelectOption.value = value;
	}

	@Input()
	public disabled = false;
}
