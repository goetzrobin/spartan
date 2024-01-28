import { Component, ContentChild, ElementRef, Input, ViewChild, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixCaretSort } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnSelectTriggerDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select-trigger',
	standalone: true,
	imports: [BrnSelectTriggerDirective, HlmIconComponent],
	providers: [provideIcons({ radixCaretSort })],
	template: `
		<button [class]="_computedClass()" #button brnSelectTrigger type="button">
			<ng-content />
			@if (icon) {
				<ng-content select="hlm-icon" />
			} @else {
				<hlm-icon class="ml-2 h-4 w-4" name="radixCaretSort" />
			}
		</button>
	`,
})
export class HlmSelectTriggerComponent {
	@ViewChild('button') buttonEl!: ElementRef;

	@ContentChild(HlmIconComponent, { static: false })
	protected icon!: HlmIconComponent;

	baseClasses =
		'flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]';

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
}
