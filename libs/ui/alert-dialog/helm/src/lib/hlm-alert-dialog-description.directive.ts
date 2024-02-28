import { computed, Directive, input } from '@angular/core';
import { BrnAlertDialogDescriptionDirective } from '@spartan-ng/ui-alertdialog-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogDescription]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAlertDialogDescriptionDirective],
})
export class HlmAlertDialogDescriptionDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-sm text-muted-foreground', this.userClass()));
}
