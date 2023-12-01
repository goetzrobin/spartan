import { CdkMenu } from '@angular/cdk/menu';
import { Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
	selector: '[brnMenu],[brnSubMenu]',
	standalone: true,
	host: {
		'[attr.data-state]': '_state()',
		'[attr.data-side]': '_side()',
	},
	hostDirectives: [CdkMenu],
})
export class BrnMenuDirective {
	private readonly _host = inject(CdkMenu);

	protected readonly _state = signal('open');
	protected readonly _side = signal('top');

	constructor() {
		this.setSideWithDarkMagic();
		// this is a best effort, but does not seem to work currently
		// TODO: figure out a way for us to know the host is about to be closed. might not be possible with CDK
		this._host.closed.pipe(takeUntilDestroyed()).subscribe(() => this._state.set('closed'));
	}

	private setSideWithDarkMagic() {
		/**
		 * This is an ugly workaround to at least figure out the correct side of where a submenu
		 * will appear and set the attribute to the host accordingly
		 */
		const overlayRef = (this._host as any)._parentTrigger.overlayRef;
		const ps = overlayRef._positionStrategy;
		const isRoot = this._host.menuStack.peek() === undefined;
		const side = isRoot
			? (ps._lastPosition ?? ps._preferredPositions[0]).originY
			: (ps._lastPosition ?? ps._preferredPositions[0]).originX === 'end'
			  ? 'right'
			  : 'left';
		this._side.set(side);
	}
}
