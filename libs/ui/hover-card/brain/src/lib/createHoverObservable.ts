import { distinctUntilChanged, filter, fromEvent, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { brnZoneOptimized } from '@spartan-ng/ui-core';
import { isElement } from './brn-hover-card-trigger.directive';
import { NgZone } from '@angular/core';

function movedOut({ currentTarget, relatedTarget }: MouseEvent): boolean {
  return !isElement(relatedTarget) || !isElement(currentTarget) || !currentTarget.contains(relatedTarget);
}

export const createHoverObservable = (
  nativeElement: HTMLElement,
  zone: NgZone,
  destroyed$: Subject<void>
): Observable<boolean> => {
  return merge(
    fromEvent(nativeElement, `mouseenter`).pipe(map(() => true)),
    fromEvent(nativeElement, `mouseleave`).pipe(map(() => false)),
    // Hello, Safari
    fromEvent<MouseEvent>(nativeElement, `mouseout`).pipe(
      filter(movedOut),
      map(() => false)
    ),
    /**
     * NOTE: onmouseout events don't trigger when objects move under mouse in Safari
     * https://bugs.webkit.org/show_bug.cgi?id=4117
     */
    fromEvent(nativeElement, `transitionend`).pipe(map(() => nativeElement.matches(`:hover`)))
  ).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};
