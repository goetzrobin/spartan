import { Component, computed, effect, ElementRef, inject, input, Renderer2, signal } from '@angular/core';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-hover-card-content',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmHoverCardContentComponent {
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	private _inputs: ClassValue = '';

	public readonly state = injectExposesStateProvider({ host: true }).state ?? signal('closed').asReadonly();
	public readonly side = injectExposedSideProvider({ host: true }).side ?? signal('bottom').asReadonly();

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
			this._renderer.setAttribute(this._element.nativeElement, 'data-side', this.side());
		});
	}

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this._inputs,
		),
	);
}
