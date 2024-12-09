import type { AutoFocusTarget } from '@angular/cdk/dialog';
import {
	type ConnectedPosition,
	type FlexibleConnectedPositionStrategyOrigin,
	OverlayPositionBuilder,
	type PositionStrategy,
	type ScrollStrategy,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import {
	ChangeDetectionStrategy,
	Component,
	type EffectRef,
	type ElementRef,
	EventEmitter,
	Injector,
	Input,
	Output,
	type TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	effect,
	inject,
	numberAttribute,
	runInInjectionContext,
	signal,
} from '@angular/core';
import { take } from 'rxjs';
import { type BrnDialogOptions, DEFAULT_BRN_DIALOG_OPTIONS } from './brn-dialog-options';
import type { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	selector: 'brn-dialog',
	standalone: true,
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnDialog',
})
export class BrnDialogComponent {
	private readonly _dialogService = inject(BrnDialogService);
	private readonly _vcr = inject(ViewContainerRef);
	public readonly positionBuilder = inject(OverlayPositionBuilder);
	public readonly ssos = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);

	private _context = {};
	protected _options: Partial<BrnDialogOptions> = {
		...DEFAULT_BRN_DIALOG_OPTIONS,
	};

	private _contentTemplate: TemplateRef<unknown> | undefined;
	private readonly _dialogRef = signal<BrnDialogRef | undefined>(undefined);
	private _dialogStateEffectRef?: EffectRef;

	public readonly state = computed(() => this._dialogRef()?.state() ?? 'closed');

	@Output()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly closed = new EventEmitter<any>();

	@Output()
	public readonly stateChanged = new EventEmitter<BrnDialogState>();

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('state')
	public set newState(state: BrnDialogState) {
		if (state === 'open') {
			this.open();
		}
		if (state === 'closed') {
			this.close(this._options.closeDelay);
		}
	}

	@Input()
	public set role(role: 'dialog' | 'alertdialog') {
		this._options.role = role;
	}

	@Input({ transform: booleanAttribute })
	public set hasBackdrop(hasBackdrop: boolean) {
		this._options.hasBackdrop = hasBackdrop;
	}

	@Input()
	public set positionStrategy(positionStrategy: PositionStrategy) {
		this._options.positionStrategy = positionStrategy;
	}

	@Input()
	public set scrollStrategy(scrollStrategy: ScrollStrategy | 'close' | 'reposition') {
		if (scrollStrategy === 'close') {
			this._options.scrollStrategy = this.ssos.close();
		} else if (scrollStrategy === 'reposition') {
			this._options.scrollStrategy = this.ssos.reposition();
		} else {
			this._options.scrollStrategy = scrollStrategy;
		}
	}

	@Input()
	public set restoreFocus(restoreFocus: boolean | string | ElementRef) {
		this._options.restoreFocus = restoreFocus;
	}

	@Input({ transform: booleanAttribute })
	public set closeOnOutsidePointerEvents(closeOnOutsidePointerEvents: boolean) {
		this._options.closeOnOutsidePointerEvents = closeOnOutsidePointerEvents;
	}

	@Input({ transform: booleanAttribute })
	public set closeOnBackdropClick(closeOnBackdropClick: boolean) {
		this._options.closeOnBackdropClick = closeOnBackdropClick;
	}

	@Input()
	public set attachTo(attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined) {
		this._options.attachTo = attachTo;
	}

	@Input()
	public set attachPositions(attachPositions: ConnectedPosition[]) {
		this._options.attachPositions = attachPositions;
	}

	@Input()
	public set autoFocus(autoFocus: AutoFocusTarget | string) {
		this._options.autoFocus = autoFocus;
	}

	@Input({ transform: numberAttribute })
	public set closeDelay(closeDelay: number) {
		this._options.closeDelay = closeDelay;
	}

	@Input({ transform: booleanAttribute })
	public set disableClose(disableClose: boolean) {
		this._options.disableClose = disableClose;
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-describedby')
	public set ariaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this.setAriaDescribedBy(ariaDescribedBy);
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-labelledby')
	public set ariaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this.setAriaLabelledBy(ariaLabelledBy);
	}

	@Input('aria-label')
	public set ariaLabel(ariaLabel: string | null | undefined) {
		this.setAriaLabel(ariaLabel);
	}

	@Input({
		alias: 'aria-modal',
		transform: booleanAttribute,
	})
	public set ariaModal(isModal: boolean) {
		this.setAriaModal(isModal);
	}

	public open<DialogContext>() {
		if (!this._contentTemplate || this._dialogRef()) return;

		this._dialogStateEffectRef?.destroy();

		const dialogRef = this._dialogService.open<DialogContext>(
			this._contentTemplate,
			this._vcr,
			this._context as DialogContext,
			this._options,
		);

		this._dialogRef.set(dialogRef);

		runInInjectionContext(this._injector, () => {
			this._dialogStateEffectRef = effect(() => this.stateChanged.emit(dialogRef.state()));
		});

		dialogRef.closed$.pipe(take(1)).subscribe((result) => {
			this._dialogRef.set(undefined);
			this.closed.emit(result);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public close(result: any, delay?: number) {
		this._dialogRef()?.close(result, delay ?? this._options.closeDelay);
	}

	public registerTemplate(template: TemplateRef<unknown>) {
		this._contentTemplate = template;
	}

	public setOverlayClass(overlayClass: string | null | undefined) {
		this._options.backdropClass = overlayClass ?? '';
		this._dialogRef()?.setOverlayClass(overlayClass);
	}

	public setPanelClass(panelClass: string | null | undefined) {
		this._options.panelClass = panelClass ?? '';
		this._dialogRef()?.setPanelClass(panelClass);
	}

	public setContext(context: unknown) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this._context = { ...this._context, ...context };
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._options = { ...this._options, ariaDescribedBy };
		this._dialogRef()?.setAriaDescribedBy(ariaDescribedBy);
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._options = { ...this._options, ariaLabelledBy };
		this._dialogRef()?.setAriaLabelledBy(ariaLabelledBy);
	}

	public setAriaLabel(ariaLabel: string | null | undefined) {
		this._options = { ...this._options, ariaLabel };
		this._dialogRef()?.setAriaLabel(ariaLabel);
	}

	public setAriaModal(ariaModal: boolean) {
		this._options = { ...this._options, ariaModal };
	}
}
