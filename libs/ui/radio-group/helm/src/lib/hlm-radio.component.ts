import { Component, computed, forwardRef, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnRadioComponent } from '@spartan-ng/ui-radiogroup-brain';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio',
	template: `
		<div style="display: flex; height: fit-content; width: fit-content" (click)="_onTouchTargetClick($event)">
			<ng-content select="[target],[indicator]" />
		</div>
		<input
			#input
			style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
			type="radio"
			[id]="inputId"
			[checked]="checked"
			[disabled]="disabled"
			[attr.name]="name"
			[attr.value]="value"
			[required]="required"
			[attr.aria-label]="ariaLabel"
			[attr.aria-labelledby]="ariaLabelledby"
			[attr.aria-describedby]="ariaDescribedby"
			(change)="_onInputInteraction($event)"
			(click)="_onInputClick($event)"
		/>
		<label style="display: flex; height: fit-content; width: fit-content" [for]="inputId">
			<ng-content />
		</label>
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
