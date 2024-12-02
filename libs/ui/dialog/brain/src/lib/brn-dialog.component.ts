import { OverlayPositionBuilder, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	type EffectRef,
	inject,
	Injector,
	input,
	numberAttribute,
	output,
	runInInjectionContext,
	signal,
	type TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly closed = output<any>();

	public readonly stateChanged = output<BrnDialogState>();

	public readonly newState = input<BrnDialogState | null>(null, { alias: 'state' });
	private readonly _newStateEffect = effect(() => {
		const state = this.newState();
		if (state === 'open') {
			this.open();
		}
		if (state === 'closed') {
			this.close(this._options.closeDelay);
		}
	});

	public readonly role = input<BrnDialogOptions['role']>('dialog');
	private readonly _roleEffect = effect(() => {
		this._options.role = this.role();
	});

	public readonly hasBackdropInput = input(true, { transform: booleanAttribute, alias: 'hasBackdrop' });
	public readonly hasBackdropState = computed(() => signal(this.hasBackdropInput()));
	public readonly hasBackdrop = computed(() => this.hasBackdropState()());
	private readonly _hasBackdropEffect = effect(() => {
		this._options.hasBackdrop = this.hasBackdrop();
	});

	public readonly positionStrategyInput = input<BrnDialogOptions['positionStrategy']>(null, {
		alias: 'positionStrategy',
	});
	public readonly positionStrategyState = computed(() => signal(this.positionStrategyInput()));
	public readonly positionStrategy = computed(() => this.positionStrategyState()());
	private readonly _positionStrategyEffect = effect(() => {
		this._options.positionStrategy = this.positionStrategy();
	});

	public readonly scrollStrategyInput = input<BrnDialogOptions['scrollStrategy'] | 'close' | 'reposition'>(null, {
		alias: 'scrollStrategy',
	});
	public readonly scrollStrategyState = computed(() => signal(this.scrollStrategyInput()));
	public readonly scrollStrategy = computed(() => this.scrollStrategyState()());
	private readonly _scrollStrategyEffect = effect(() => {
		const scrollStrategy = this.scrollStrategy();
		if (scrollStrategy === 'close') {
			this._options.scrollStrategy = this.ssos.close();
		} else if (scrollStrategy === 'reposition') {
			this._options.scrollStrategy = this.ssos.reposition();
		} else {
			this._options.scrollStrategy = scrollStrategy;
		}
	});

	public readonly restoreFocus = input<BrnDialogOptions['restoreFocus']>(true);
	private readonly _restoreFocusEffect = effect(() => {
		this._options.restoreFocus = this.restoreFocus();
	});

	public readonly closeOnOutsidePointerEventsInput = input(false, {
		transform: booleanAttribute,
		alias: 'closeOnOutsidePointerEvents',
	});
	public readonly closeOnOutsidePointerEventsState = computed(() => signal(this.closeOnOutsidePointerEventsInput()));
	public readonly closeOnOutsidePointerEvents = computed(() => this.closeOnOutsidePointerEventsState()());
	private readonly _closeOnOutsidePointerEventsEffect = effect(() => {
		this._options.closeOnOutsidePointerEvents = this.closeOnOutsidePointerEvents();
	});

	public readonly closeOnBackdropClickInput = input(true, {
		transform: booleanAttribute,
		alias: 'closeOnBackdropClick',
	});
	private readonly _closeOnBackdropClickEffect = effect(() => {
		this._options.closeOnBackdropClick = this.closeOnBackdropClickInput();
	});

	public readonly attachToInput = input<BrnDialogOptions['attachTo']>(null, { alias: 'attachTo' });
	public readonly attachToState = computed(() => signal(this.attachToInput()));
	public readonly attachTo = computed(() => this.attachToState()());
	private readonly _attachToEffect = effect(() => {
		this._options.attachTo = this.attachTo();
	});

	public readonly attachPositionsInput = input<BrnDialogOptions['attachPositions']>([], { alias: 'attachPositions' });
	public readonly attachPositionsState = computed(() => signal(this.attachPositionsInput()));
	public readonly attachPositions = computed(() => this.attachPositionsState()());
	private readonly _attachPositionsEffect = effect(() => {
		this._options.attachPositions = this.attachPositions();
	});

	public readonly autoFocusInput = input<BrnDialogOptions['autoFocus']>('first-tabbable', { alias: 'autoFocus' });
	private readonly _autoFocusEffect = effect(() => {
		this._options.autoFocus = this.autoFocusInput();
	});

	public readonly closeDelayInput = input(0, { alias: 'closeDelay', transform: numberAttribute });
	public readonly closeDelayState = computed(() => signal(this.closeDelayInput()));
	public readonly closeDelay = computed(() => this.closeDelayState()());
	private readonly _closeDelayEffect = effect(() => {
		this._options.closeDelay = this.closeDelay();
	});

	public readonly disableCloseInput = input(false, { transform: booleanAttribute, alias: 'disableClose' });
	private readonly _disableCloseEffect = effect(() => {
		this._options.disableClose = this.disableCloseInput();
	});

	public readonly ariaDescribedByInput = input<BrnDialogOptions['ariaDescribedBy']>(null, {
		alias: 'aria-describedby',
	});
	public readonly ariaDescribedByState = computed(() => signal(this.ariaDescribedByInput()));
	public readonly ariaDescribedBy = computed(() => this.ariaDescribedByState()());
	private readonly _ariaDescribedByEffect = effect(() => {
		const ariaDescribedBy = this.ariaDescribedBy();
		this.setAriaDescribedBy(ariaDescribedBy);
	});

	public readonly ariaLabelledByInput = input<BrnDialogOptions['ariaLabelledBy']>(null, { alias: 'aria-labelledby' });
	public readonly ariaLabelledByState = computed(() => signal(this.ariaLabelledByInput()));
	public readonly ariaLabelledBy = computed(() => this.ariaLabelledByState()());
	private readonly _ariaLabelledByEffect = effect(() => {
		const ariaLabelledBy = this.ariaLabelledBy();
		this.setAriaLabelledBy(ariaLabelledBy);
	});

	public readonly ariaLabelInput = input<BrnDialogOptions['ariaLabel']>(null, { alias: 'aria-label' });
	public readonly ariaLabelState = computed(() => signal(this.ariaLabelInput()));
	public readonly ariaLabel = computed(() => this.ariaLabelState()());
	private readonly _ariaLabelEffect = effect(() => {
		const ariaLabel = this.ariaLabel();
		this.setAriaLabel(ariaLabel);
	});

	public readonly ariaModalInput = input(true, {
		alias: 'aria-modal',
		transform: booleanAttribute,
	});
	public readonly ariaModalState = computed(() => signal(this.ariaModalInput()));
	public readonly ariaModal = computed(() => this.ariaModalState()());
	private readonly _ariaModalEffect = effect(() => {
		const isModal = this.ariaModal();
		this.setAriaModal(isModal);
	});

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
