import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent, interval, takeUntil } from 'rxjs';
import { BrnSelectContentComponent } from './brn-select-content.component';

@Directive({
	selector: '[brnSelectScrollDown], brn-select-scroll-down, hlm-select-scroll-down:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		'(mouseenter)': 'startEmittingEvents()',
	},
})
export class BrnSelectScrollDownDirective {
	private _el = inject(ElementRef);
	private _selectContent = inject(BrnSelectContentComponent);

	private endReached = new Subject<boolean>();
	private _destroyRef = inject(DestroyRef);

	startEmittingEvents(): void {
		const mouseLeave$ = fromEvent(this._el.nativeElement, 'mouseleave');

		interval(100)
			.pipe(takeUntil(mouseLeave$), takeUntil(this.endReached), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._selectContent.moveFocusDown());
	}

	stopEmittingEvents(): void {
		this.endReached.next(true);
	}
}
