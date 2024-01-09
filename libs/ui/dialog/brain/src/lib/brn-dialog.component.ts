import { AutoFocusTarget } from '@angular/cdk/dialog';
import {
	ConnectedPosition,
	FlexibleConnectedPositionStrategyOrigin,
	OverlayPositionBuilder,
	PositionStrategy,
	ScrollStrategy,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	Output,
	TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	numberAttribute,
} from '@angular/core';
import { BrnDialogOptions, BrnDialogService, provideBrnDialog } from './brn-dialog.service';

let dialogSequence = 0;

export type BrnDialogState = 'open' | 'closed';

@Component({
	selector: 'brn-dialog',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [provideBrnDialog()],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnDialog',
})
export class BrnDialogComponent {
	private readonly _dialogService = inject(BrnDialogService);
	private readonly _vcr = inject(ViewContainerRef);
	private _contentTemplate: TemplateRef<unknown> | undefined;
	public readonly positionBuilder = inject(OverlayPositionBuilder);
	public readonly ssos = inject(ScrollStrategyOptions);
	public readonly state = this._dialogService.state;
	public readonly dialogId = dialogSequence++;

	private _context = {};
	protected _options: BrnDialogOptions = {
		role: 'dialog',
		id: 'brn-dialog-' + this.dialogId,
		attachPositions: [],
		attachTo: null,
		autoFocus: 'first-tabbable',
		backdropClass: '',
		closeDelay: 0,
		closeOnOutsidePointerEvents: true,
		hasBackdrop: true,
		panelClass: '',
		positionStrategy: null,
		restoreFocus: true,
		scrollStrategy: null,
		disableClose: false,
		ariaDescribedBy: 'brn-dialog-description-' + this.dialogId,
		ariaLabelledBy: 'brn-dialog-title-' + this.dialogId,
		ariaLabel: undefined,
		ariaModal: true,
	};

	@Output()
	public readonly closed = this._dialogService.closed;

	@Output()
	public readonly stateChanged = this._dialogService.stateChange;

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('state')
	set newState(state: BrnDialogState) {
		if (state === 'open') {
			this.open();
		}
		if (state === 'closed') {
			this.close(this._options['closeDelay']);
		}
	}

	@Input()
	set role(role: 'dialog' | 'alertdialog') {
		this._options['role'] = role;
	}

	@Input({ transform: booleanAttribute })
	set hasBackdrop(hasBackdrop: boolean) {
		this._options['hasBackdrop'] = hasBackdrop;
	}

	@Input()
	set positionStrategy(positionStrategy: PositionStrategy) {
		this._options['positionStrategy'] = positionStrategy;
	}

	@Input()
	set scrollStrategy(scrollStrategy: ScrollStrategy | 'close' | 'reposition') {
		if (scrollStrategy === 'close') {
			this._options['scrollStrategy'] = this.ssos.close();
		} else if (scrollStrategy === 'reposition') {
			this._options['scrollStrategy'] = this.ssos.reposition();
		} else {
			this._options['scrollStrategy'] = scrollStrategy;
		}
	}

	@Input()
	set restoreFocus(restoreFocus: boolean | string | ElementRef) {
		this._options['restoreFocus'] = restoreFocus;
	}

	@Input({ transform: booleanAttribute })
	set closeOnOutsidePointerEvents(closeOnOutsidePointerEvents: boolean) {
		this._options['closeOnOutsidePointerEvents'] = closeOnOutsidePointerEvents;
	}

	@Input()
	set attachTo(attachTo: FlexibleConnectedPositionStrategyOrigin | null | undefined) {
		this._options['attachTo'] = attachTo;
	}

	@Input()
	set attachPositions(attachPositions: ConnectedPosition[]) {
		this._options['attachPositions'] = attachPositions;
	}

	@Input()
	set autoFocus(autoFocus: AutoFocusTarget | string) {
		this._options['autoFocus'] = autoFocus;
	}

	@Input({ transform: numberAttribute })
	set closeDelay(closeDelay: number) {
		this._options['closeDelay'] = closeDelay;
	}

	@Input({ transform: booleanAttribute })
	set disableClose(disableClose: boolean) {
		this._options['disableClose'] = disableClose;
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-describedby')
	set ariaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this.setAriaDescribedBy(ariaDescribedBy);
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-labelledby')
	set ariaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this.setAriaLabelledBy(ariaLabelledBy);
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-label')
	set ariaLabel(ariaLabel: string | null | undefined) {
		this.setAriaLabel(ariaLabel);
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input({
		alias: 'aria-modal',
		transform: booleanAttribute,
	})
	set ariaModal(isModal: boolean) {
		this.setAriaModal(isModal);
	}

	open<DialogContext>() {
		if (!this._contentTemplate) return;
		this._dialogService.open<DialogContext>(
			this._vcr,
			this._contentTemplate,
			this._context as DialogContext,
			this._options,
		);
	}

	close(delay?: number) {
		this._dialogService.close(delay ?? this._options.closeDelay);
	}

	registerTemplate(tpl: TemplateRef<unknown>) {
		this._contentTemplate = tpl;
	}

	setOverlayClass(overlayClass: string | null | undefined) {
		this._options['backdropClass'] = overlayClass ?? '';
	}

	setPanelClass(panelClass: string | null | undefined) {
		this._options['panelClass'] = panelClass ?? '';
	}

	setContext(context: unknown) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this._context = { ...this._context, ...context };
	}

	setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._options = { ...this._options, ariaDescribedBy };
		this._dialogService.setAriaDescribedBy(ariaDescribedBy);
	}

	setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._options = { ...this._options, ariaLabelledBy };
		this._dialogService.setAriaLabelledBy(ariaLabelledBy);
	}

	setAriaLabel(ariaLabel: string | null | undefined) {
		this._options = { ...this._options, ariaLabel };
		this._dialogService.setAriaLabel(ariaLabel);
	}

	setAriaModal(ariaModal: boolean) {
		this._options = { ...this._options, ariaModal };
	}
}
