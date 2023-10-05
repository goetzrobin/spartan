/**
 * We are building on shoulders of giants here and use the implementation provided by the incredible TaigaUI
 * team: https://github.com/taiga-family/taiga-ui/blob/main/projects/core/directives/dropdown/dropdown-hover.directive.ts
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */

import {
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  delay,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  share,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { BrnHoverCardContentService } from './brn-hover-card-content.service';
import { createHoverObservable } from './createHoverObservable';
import { BrnHoverCardContentDirective } from './brn-hover-card-content.directive';
import { FocusMonitor } from '@angular/cdk/a11y';

export function isElement(node?: Element | EventTarget | Node | null): node is Element {
  return !!node && `nodeType` in node && node.nodeType === Node.ELEMENT_NODE;
}

@Directive({
  selector: '[brnHoverCardTrigger]:not(ng-container),[brnHoverCardTriggerFor]:not(ng-container)',
  standalone: true,
  exportAs: 'brnHoverCardTrigger',
})
export class BrnHoverCardTriggerDirective implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _zone = inject(NgZone);
  private readonly _el = inject(ElementRef);
  private readonly _contentService = inject(BrnHoverCardContentService);
  private readonly _focusMonitor = inject(FocusMonitor);

  public readonly focused$: Observable<boolean> = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));

  public readonly hovered$: Observable<boolean> = merge(
    createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
    this._contentService.hovered$,
    this.focused$
  ).pipe(distinctUntilChanged());
  public readonly showing$: Observable<boolean> = this.hovered$.pipe(
    // we set the state to open here because we are about to open show the content
    tap((visible) => visible && this._contentService.setState('open')),
    switchMap((visible) => {
      // we are delaying based on the configure-able input
      return of(visible).pipe(delay(visible ? this.showDelay : this.hideDelay));
    }),
    switchMap((visible) => {
      // don't do anything when we are in the process of showing the content
      if (visible) return of(visible);
      // we set the state to closed here to trigger any animations for the element leaving
      this._contentService.setState('closed');
      // then delay to wait for the leaving animation to finish
      return of(visible).pipe(delay(this.animationDelay));
    }),
    distinctUntilChanged(),
    share(),
    takeUntil(this._destroy$)
  );

  @Input()
  public showDelay = 300;
  @Input()
  public hideDelay = 500;
  @Input()
  public animationDelay = 100;
  @Input()
  public sideOffset = 5;

  @Input()
  public align: 'top' | 'bottom' = 'bottom';

  @Input()
  set brnHoverCardTriggerFor(value: TemplateRef<unknown> | BrnHoverCardContentDirective) {
    this._contentService.setContent(value, this._vcr);
  }

  public ngOnInit() {
    this._contentService.setConfig({ attachTo: this._el, align: this.align, sideOffset: this.sideOffset });
    this.showing$.subscribe((isHovered) => {
      if (isHovered) {
        this._contentService.show();
      } else {
        this._contentService.hide();
      }
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
