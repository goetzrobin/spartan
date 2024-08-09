import { Component, computed, forwardRef, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnRadioComponent } from '@spartan-ng/ui-radiogroup-brain';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio',
	template: `
		<!-- TODO project correctly into BrnRadioComponent target and label content -->
		<ng-content select="[target],[indicator]" />
		<ng-content />
	`,
	providers: [
		{
			provide: BrnRadioComponent,
			useExisting: forwardRef(() => HlmRadioComponent),
		},
	],
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioComponent extends BrnRadioComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('group [&.brn-radio-disabled]:text-muted-foreground flex items-center space-x-2', this.userClass()),
	);
}
