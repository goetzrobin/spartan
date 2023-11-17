import { Directive, effect, ElementRef, HostBinding, inject, Input, Renderer2, signal } from '@angular/core';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { HlmCommandDirective } from './hlm-command.directive';

@Directive({
	selector: '[hlmCmdDialog]',
	standalone: true,
	hostDirectives: [HlmCommandDirective],
})
export class HlmCommandDialogDirective {
	private _stateProvider = injectExposesStateProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed').asReadonly();
	private _renderer = inject(Renderer2);
	private _element = inject(ElementRef);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}

	@HostBinding('class')
	private _class = this.generateClass();
	private _inputs: ClassValue = '';

	@Input()
	set class(inputs: ClassValue) {
		this._inputs = inputs;
		this._class = this.generateClass();
	}

	generateClass() {
		return hlm(
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%]',
			this._inputs,
		);
	}
}
