import { Component, ContentChild, type ElementRef, ViewChild, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnSelectTriggerDirective } from '@spartan-ng/ui-select-brain';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select-trigger',
	standalone: true,
	imports: [BrnSelectTriggerDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronDown })],
	template: `
		<button [class]="_computedClass()" #button brnSelectTrigger type="button">
			<ng-content />
			@if (icon) {
				<ng-content select="hlm-icon" />
			} @else {
				<hlm-icon class="flex-none w-4 h-4 ml-2" name="lucideChevronDown" />
			}
		</button>
	`,
})
export class HlmSelectTriggerComponent {
	@ViewChild('button', { static: true })
	public buttonEl!: ElementRef;

	@ContentChild(HlmIconComponent, { static: false })
	protected icon!: HlmIconComponent;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]',
			this.userClass(),
		),
	);
}
