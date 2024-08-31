import { Component, ContentChild, type ElementRef, ViewChild, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnSelectComponent, BrnSelectTriggerDirective } from '@spartan-ng/ui-select-brain';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const selectTriggerVariants = cva(
	'flex items-center justify-between rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
			},
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
				true: 'text-destructive border-destructive focus-visible:ring-destructive',
			},
		},
		defaultVariants: {
			size: 'default',
			error: 'auto',
		},
	},
);
type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

@Component({
	selector: 'hlm-select-trigger',
	standalone: true,
	imports: [BrnSelectTriggerDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronDown })],
	template: `
		<button [class]="_computedClass()" #button hlmInput brnSelectTrigger type="button">
			<ng-content />
			@if (icon) {
				<ng-content select="hlm-icon" />
			} @else {
				<hlm-icon class="ml-2 h-4 w-4 flex-none" name="lucideChevronDown" />
			}
		</button>
	`,
})
export class HlmSelectTriggerComponent {
	@ViewChild('button', { static: true })
	public buttonEl!: ElementRef;

	@ContentChild(HlmIconComponent, { static: false })
	protected icon!: HlmIconComponent;

	protected readonly brnSelect = inject(BrnSelectComponent, { optional: true });

	public readonly _size = input<SelectTriggerVariants['size']>('default');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected _computedClass = computed(() =>
		hlm(selectTriggerVariants({ size: this._size(), error: this.brnSelect?.errorState() }), this.userClass()),
	);
}
