import {
  computed,
  effect,
  ElementRef,
  inject,
  Injectable,
  OnDestroy,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AutoFocusTarget, Dialog, DIALOG_DATA, DIALOG_SCROLL_STRATEGY_PROVIDER, DialogRef } from '@angular/cdk/dialog';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin,
  OverlayPositionBuilder,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ComponentType } from 'react';
import { filter, Subject, takeUntil } from 'rxjs';

export const provideBrnDialog = () => [Dialog, BrnDialogService, DIALOG_SCROLL_STRATEGY_PROVIDER];

export type BrnDialogOptions = {
  id: string;
  role: 'dialog' | 'alertdialog';
  hasBackdrop: boolean;
  panelClass: string | string[];
  backdropClass: string | string[];
  positionStrategy: PositionStrategy | null | undefined;
  scrollStrategy: ScrollStrategy | null | undefined;
  restoreFocus: boolean | string | ElementRef;
  closeDelay: number;
  closeOnOutsidePointerEvents: boolean;
  attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined;
  attachPositions: ConnectedPosition[];
  autoFocus: AutoFocusTarget | string;
  disableClose: boolean;
  ariaDescribedBy: string | null | undefined;
  ariaLabelledBy: string | null | undefined;
  ariaLabel: string | null | undefined;
  ariaModal: boolean;
};

export type BrnDialogContext<T> = T & { close: () => void };

export const injectBrnDialogCtx = <T>(): BrnDialogContext<T> => {
  return inject(DIALOG_DATA);
};

const cssClassesToArray = (classes: string | string[] | undefined | null, defaultClass = ''): string[] => {
  if (typeof classes === 'string') {
    const splitClasses = classes.trim().split(' ');
    if (splitClasses.length === 0) {
      return [defaultClass];
    }
    return splitClasses;
  }
  return classes ?? [];
};

@Injectable()
export class BrnDialogService implements OnDestroy {
  private _destroyed$ = new Subject<void>();

  private _cdkDialog = inject(Dialog);
  private _renderer = inject(Renderer2);
  private _positionBuilder = inject(OverlayPositionBuilder);
  private _sso = inject(ScrollStrategyOptions);
  private _dialogRef?: DialogRef;

  private _open = signal(false);
  public state = computed(() => (this._open() ? 'open' : 'closed'));
  private _overlay: HTMLElement | null = null;
  private _backdrop: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this._overlay) {
        this._renderer.setAttribute(this._overlay, 'data-state', this.state());
      }
      if (this._backdrop) {
        this._renderer.setAttribute(this._backdrop, 'data-state', this.state());
      }
    });
  }

  public open<DialogContext>(
    vcr: ViewContainerRef,
    content: ComponentType<unknown> | TemplateRef<unknown>,
    context?: DialogContext,
    options?: Partial<BrnDialogOptions>
  ): void {
    if (this._open() || (options?.id && this._cdkDialog.getDialogById(options.id))) {
      return;
    }
    const positionStrategy =
      options?.positionStrategy ??
      (options?.attachTo && options?.attachPositions && options?.attachPositions?.length > 0
        ? this._positionBuilder?.flexibleConnectedTo(options.attachTo).withPositions(options.attachPositions ?? [])
        : this._positionBuilder.global().centerHorizontally().centerVertically());
    const contextOrData = { ...context, close: () => this.close(options?.closeDelay) };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._dialogRef = this._cdkDialog.open(content, {
      id: options?.id,
      role: options?.role,
      viewContainerRef: vcr,
      templateContext: contextOrData,
      data: contextOrData,
      hasBackdrop: options?.hasBackdrop,
      panelClass: cssClassesToArray(options?.panelClass),
      backdropClass: cssClassesToArray(options?.backdropClass, 'bg-transparent'),
      positionStrategy,
      scrollStrategy: options?.scrollStrategy ?? this._sso?.block(),
      restoreFocus: options?.restoreFocus,
      disableClose: true,
      autoFocus: options?.autoFocus ?? 'first-tabbable',
      ariaDescribedBy: options?.ariaDescribedBy,
      ariaLabelledBy: options?.ariaLabelledBy,
      ariaLabel: options?.ariaLabel,
      ariaModal: options?.ariaModal,
    });

    if (!this._dialogRef) return;
    this._overlay = this._dialogRef.overlayRef.overlayElement;
    this._backdrop = this._dialogRef.overlayRef.backdropElement;

    if (options?.closeOnOutsidePointerEvents) {
      this._dialogRef.outsidePointerEvents.pipe(takeUntil(this._destroyed$)).subscribe(() => {
        this.close(options?.closeDelay);
      });
    }
    if (!options?.disableClose) {
      this._dialogRef.keydownEvents
        .pipe(
          filter((e) => e.key === 'Escape'),
          takeUntil(this._destroyed$)
        )
        .subscribe(() => {
          this.close(options?.closeDelay);
        });
    }

    this._dialogRef.closed.pipe(takeUntil(this._destroyed$)).subscribe(() => {
      this._open.set(false);
    });

    this._open.set(true);
  }

  public close(delay = 0): void {
    this._open.set(false);
    setTimeout(() => {
      this._dialogRef?.close();
    }, delay);
  }

  public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
    if (!this._dialogRef) return;
    this._dialogRef.config.ariaDescribedBy = ariaDescribedBy;
  }

  public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
    if (!this._dialogRef) return;
    this._dialogRef.config.ariaLabelledBy = ariaLabelledBy;
  }

  public setAriaLabel(ariaLabel: string | null | undefined) {
    if (!this._dialogRef) return;
    this._dialogRef.config.ariaLabel = ariaLabel;
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
