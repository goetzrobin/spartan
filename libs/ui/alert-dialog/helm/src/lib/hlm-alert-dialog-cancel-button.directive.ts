import { Directive, computed, input } from '@angular/core';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	providers: [provideBrnButtonConfig({ variant: 'outline' })],
	host: {
		'[class]': 'computedClass()',
	},
})
export class HlmAlertDialogCancelButtonDirective {
	readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly computedClass = computed(() => hlm('mt-2 sm:mt-0', this.userClass()));
}
