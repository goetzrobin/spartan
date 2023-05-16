import { ChangeDetectorRef, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, Observable, tap } from 'rxjs';

export function rxHostListener<T extends Event>(event: string): Observable<T> {
  const cdr = inject(ChangeDetectorRef);

  // Listen to event
  return fromEvent<T>(inject(ElementRef).nativeElement, event).pipe(
    debounceTime(0),
    tap(() => cdr.markForCheck()), // Trigger CD like @HostListener would
    takeUntilDestroyed() // Unsubscribe
  );
}

export function rxHostBinding<T>(prop: string, stream: Observable<T>) {
  // Listen to the stream
  stream
    .pipe(takeUntilDestroyed()) // Unsubscribe
    .subscribe(process(inject(ElementRef).nativeElement, prop)); // Process
}

function process<T>(element: HTMLElement, prop: string): (value: T) => void {
  const isAttr = prop.startsWith('attr.');
  const isStyle = prop.startsWith('style.');
  const isClass = prop.startsWith('class.');
  const [key, unit = ''] = prop
    .replace('attr.', '')
    .replace('style.', '')
    .replace('class.', '')
    .split('.');

  return (value) => {
    const parsed = unit && value != null ? `${value}${unit}` : value;

    if (isAttr) {
      if (value == null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, String(parsed));
      }
    } else if (isClass) {
      element.classList.toggle(key, !!value);
    } else if (isStyle) {
      // @ts-ignore
      element.style[key] = parsed;
    } else {
      // @ts-ignore
      element[key] = parsed;
    }
  };
}
