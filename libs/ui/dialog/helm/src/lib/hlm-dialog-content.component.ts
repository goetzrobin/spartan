import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { BrnDialogCloseDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';
import { HlmDialogCloseDirective } from './hlm-dialog-close.directive';

@Component({
	selector: 'hlm-dialog-content',
	standalone: true,
	imports: [BrnDialogCloseDirective, HlmDialogCloseDirective, HlmIconComponent],
	providers: [provideIcons({ radixCross1 })],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<ng-content />
		<button brnDialogClose hlm>
			<span class="sr-only">Close</span>
			<hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmDialogContentComponent {
	private readonly _statusProvider = injectExposesStateProvider({ host: true });
	public readonly state = this._statusProvider.state ?? signal('closed').asReadonly();

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border grid w-full max-w-lg relative gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg md:w-full',
			this._userClass(),
		),
	);
}
