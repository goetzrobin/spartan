import { ElementRef, inject, Injectable, NgZone, Signal, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import {
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { createHoverObservable } from './createHoverObservable';
import { BehaviorSubject, filter, map, Observable, of, Subject, switchMap } from 'rxjs';
import { BrnHoverCardContentDirective } from './brn-hover-card-content.directive';
import { toSignal } from '@angular/core/rxjs-interop';

export type BrnHoverCardOptions = Partial<
  {
    attachTo: ElementRef;
    attachPositions: ConnectedPosition[];
    align: 'top' | 'bottom';
    sideOffset: number;
  } & OverlayConfig
>;

const topFirstPositions: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
  },
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
];
const bottomFirstPositions: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
  },
];

@Injectable()
export class BrnHoverCardContentService {
  private readonly _overlay = inject(Overlay);
  private readonly _zone = inject(NgZone);
  private readonly _psBuilder = inject(OverlayPositionBuilder);

  private readonly _content = signal<TemplatePortal<unknown> | null>(null);
  private readonly _state = signal<'open' | 'closed'>('closed');

  private _config: BrnHoverCardOptions = {};
  private _overlayRef?: OverlayRef;
  private _positionStrategy?: FlexibleConnectedPositionStrategy;
  private _destroyed$ = new Subject<void>();

  private _positionChangesObservables$ = new BehaviorSubject<Observable<ConnectedOverlayPositionChange> | undefined>(
    undefined
  );
  private _overlayHoveredObservables$ = new BehaviorSubject<Observable<boolean> | undefined>(undefined);

  public readonly positionChanges$: Observable<ConnectedOverlayPositionChange> = this._positionChangesObservables$.pipe(
    switchMap((positionChangeObservable) => (positionChangeObservable ? positionChangeObservable : of(undefined))),
    filter((change): change is NonNullable<ConnectedOverlayPositionChange> => change !== undefined && change !== null)
  );
  public readonly hovered$: Observable<boolean> = this._overlayHoveredObservables$.pipe(
    switchMap((overlayHoveredObservable) => (overlayHoveredObservable ? overlayHoveredObservable : of(false)))
  );

  public readonly state = this._state.asReadonly();
  public readonly side: Signal<'top' | 'bottom' | 'left' | 'right'> = toSignal(
    this.positionChanges$.pipe(
      map<ConnectedOverlayPositionChange, 'top' | 'bottom' | 'left' | 'right'>((change) =>
        // todo: better translation or adjusting hlm to take that into account
        change.connectionPair.originY === 'center'
          ? change.connectionPair.originX === 'start'
            ? 'left'
            : 'right'
          : change.connectionPair.originY
      )
    ),
    { initialValue: 'bottom' }
  );

  public setConfig(config: BrnHoverCardOptions) {
    this._config = config;
    if (config['attachTo']) {
      this._positionStrategy = this._psBuilder
        .flexibleConnectedTo(config['attachTo'])
        .withPositions(
          config['attachPositions'] ?? config['align'] === 'top' ? topFirstPositions : bottomFirstPositions
        )
        .withDefaultOffsetY(config['sideOffset'] ?? 0);
      this._config = {
        ...this._config,
        positionStrategy: this._positionStrategy,
      };
      this._positionChangesObservables$.next(this._positionStrategy.positionChanges);
    }
    this._overlayRef = this._overlay.create(this._config);
  }

  public setContent(value: TemplateRef<unknown> | BrnHoverCardContentDirective, vcr: ViewContainerRef) {
    this._content.set(new TemplatePortal<unknown>(value instanceof TemplateRef ? value : value.template, vcr));

    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._config);
    }
  }

  public setState(newState: 'open' | 'closed') {
    this._state.set(newState);
  }

  public show() {
    const content = this._content();
    if (!content || !this._overlayRef) return;

    this._overlayRef?.detach();
    this._overlayRef?.attach(content);

    this._destroyed$ = new Subject<void>();

    this._overlayHoveredObservables$.next(
      createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$)
    );
  }

  public hide() {
    this._overlayRef?.detach();
    this._destroyed$.next();
    this._destroyed$.complete();
    this._destroyed$ = new Subject<void>();
  }
}
