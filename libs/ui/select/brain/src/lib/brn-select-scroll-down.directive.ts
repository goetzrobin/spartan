import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent, interval, takeUntil } from 'rxjs';
import { BrnSelectContentDirective } from './brn-select-content.directive';

@Directive({
	selector: '[brnSelectScrollDown], brn-select-scroll-down',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollDownDirective {
	private readonly _el = inject(ElementRef);
	private readonly _selectContent = inject(BrnSelectContentDirective);

	private readonly endReached = new Subject<boolean>();
	private readonly _destroyRef = inject(DestroyRef);

	public startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this.endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.moveFocusDown());
	}

	public stopEmittingEvents(): void {
		this.endReached.next(true);
	}
}
