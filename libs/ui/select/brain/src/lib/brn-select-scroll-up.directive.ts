import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent, interval, takeUntil } from 'rxjs';
import { BrnSelectContentComponent } from './brn-select-content.component';

// TODO: Need to check if scroll up or down is possible and this determines whether they are displayed
@Directive({
	selector: '[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollUpDirective {
	private _el = inject(ElementRef);
	private _selectContent = inject(BrnSelectContentComponent);

	private endReached = new Subject<boolean>();
	private _destroyRef = inject(DestroyRef);

	startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this.endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.moveFocusUp());
	}

	stopEmittingEvents(): void {
		this.endReached.next(true);
	}
}
