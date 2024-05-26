import { CdkListbox, CdkListboxModule } from '@angular/cdk/listbox';
import {
	CdkConnectedOverlay,
	type ConnectedOverlayPositionChange,
	type ConnectedPosition,
	OverlayModule,
} from '@angular/cdk/overlay';
import {
	type AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	type OnInit,
	type Signal,
	computed,
	contentChild,
	contentChildren,
	inject,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NgControl } from '@angular/forms';
import {
	type ExposesSide,
	type ExposesState,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/ui-core';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { Subject, delay, filter, map, of, switchMap } from 'rxjs';
import { BrnSelectContentComponent } from './brn-select-content.component';
import { BrnSelectOptionDirective } from './brn-select-option.directive';
import { BrnSelectTriggerDirective } from './brn-select-trigger.directive';
import { BrnSelectService } from './brn-select.service';

export type BrnReadDirection = 'ltr' | 'rtl';

let nextId = 0;

@Component({
	selector: 'brn-select, hlm-select',
	standalone: true,
	imports: [OverlayModule, BrnSelectTriggerDirective, CdkListboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		BrnSelectService,
		CdkListbox,
		provideExposedSideProviderExisting(() => BrnSelectComponent),
		provideExposesStateProviderExisting(() => BrnSelectComponent),
	],
	template: `
		@if (!labelProvided() && placeholder()) {
			<label class="hidden" [attr.id]="backupLabelId()">{{ placeholder() }}</label>
		} @else {
			<ng-content select="label[hlmLabel],label[brnLabel]" />
		}

		<div cdk-overlay-origin (click)="toggle()" #trigger="cdkOverlayOrigin">
			<ng-content select="hlm-select-trigger,[brnSelectTrigger]" />
		</div>
		<ng-template
			cdk-connected-overlay
			cdkConnectedOverlayLockPosition
			cdkConnectedOverlayHasBackdrop
			cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
			[cdkConnectedOverlayOrigin]="trigger"
			[cdkConnectedOverlayOpen]="_delayedExpanded()"
			[cdkConnectedOverlayPositions]="_positions"
			[cdkConnectedOverlayWidth]="triggerWidth() > 0 ? triggerWidth() : 'auto'"
			(backdropClick)="close()"
			(detach)="close()"
			(positionChange)="_positionChanges$.next($event)"
		>
			<ng-content />
		</ng-template>
	`,
})
export class BrnSelectComponent implements OnInit, ControlValueAccessor, AfterContentInit, ExposesSide, ExposesState {
	private readonly _selectService = inject(BrnSelectService);

	public readonly triggerWidth = this._selectService.triggerWidth;

	public placeholder = input<string>('');

	public multiple = model<boolean>(false);

	public disabled = model<boolean>(false);

	public readonly dir = input<BrnReadDirection>('ltr');

	protected selectLabel = contentChild(BrnLabelDirective, { descendants: true });

	/** Overlay pane containing the options. */
	protected selectContent = contentChild(BrnSelectContentComponent);
	protected options = contentChildren<BrnSelectOptionDirective>(BrnSelectOptionDirective, { descendants: true });

	/** Overlay pane containing the options. */
	protected _overlayDir = contentChild(CdkConnectedOverlay);

	openedChange = output<boolean>();

	public readonly closeDelay = input<number>(100);
	public readonly isExpanded = this._selectService.isExpanded;
	protected readonly _delayedExpanded = toSignal(
		toObservable(this.isExpanded).pipe(
			switchMap((expanded) => (!expanded ? of(expanded).pipe(delay(this.closeDelay())) : of(expanded))),
			takeUntilDestroyed(),
		),
		{ initialValue: false },
	);
	public readonly state = computed(() => (this.isExpanded() ? 'open' : 'closed'));

	protected readonly _positionChanges$ = new Subject<ConnectedOverlayPositionChange>();
	public readonly side: Signal<'top' | 'bottom' | 'left' | 'right'> = toSignal(
		this._positionChanges$.pipe(
			map<ConnectedOverlayPositionChange, 'top' | 'bottom' | 'left' | 'right'>((change) =>
				// todo: better translation or adjusting hlm to take that into account
				change.connectionPair.originY === 'center'
					? change.connectionPair.originX === 'start'
						? 'left'
						: 'right'
					: change.connectionPair.originY,
			),
		),
		{ initialValue: 'bottom' },
	);

	public readonly backupLabelId = computed(() => this._selectService.labelId());
	public readonly labelProvided = signal(false);

	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onChange: (value: unknown) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched = () => {};

	private _shouldEmitValueChange = signal(false);

	private id = computed(() => this._selectService.id());

	/*
	 * This position config ensures that the top "start" corner of the overlay
	 * is aligned with with the top "start" of the origin by default (overlapping
	 * the trigger completely). If the panel cannot fit below the trigger, it
	 * will fall back to a position above the trigger.
	 */
	protected _positions: ConnectedPosition[] = [
		{
			originX: 'start',
			originY: 'bottom',
			overlayX: 'start',
			overlayY: 'top',
		},
		{
			originX: 'end',
			originY: 'bottom',
			overlayX: 'end',
			overlayY: 'top',
		},
		{
			originX: 'start',
			originY: 'top',
			overlayX: 'start',
			overlayY: 'bottom',
		},
		{
			originX: 'end',
			originY: 'top',
			overlayX: 'end',
			overlayY: 'bottom',
		},
	];

	constructor() {
		this._selectService.updateId(`brn-select-${nextId++}`);

		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		// Watch for Listbox Selection Changes to trigger Collapse
		this._selectService.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe(() => {
			if (!this.multiple()) {
				this.close();
			}
		});

		/**
		 * Listening to value changes in order to trigger forms api on change
		 * ShouldEmitValueChange simply ensures we only propagate value change when a user makes a selection
		 * we dont propagate changes made from outside the component (ex. patch value or initial value from form control)
		 */
		toObservable(this._selectService.value)
			.pipe(
				filter(() => {
					const shouldEmitValueChange = this._shouldEmitValueChange();
					this._shouldEmitValueChange.set(true);
					return shouldEmitValueChange;
				}),
				takeUntilDestroyed(),
			)
			.subscribe((value) => this._onChange(value ?? null));

		toObservable(this.dir)
			.pipe(takeUntilDestroyed())
			.subscribe(() => this._selectService.updateDir(this.dir()));

		toObservable(this.placeholder)
			.pipe(takeUntilDestroyed())
			.subscribe((placeholder) => this._selectService.updatePlaceholder(placeholder));

		toObservable(this.disabled)
			.pipe(takeUntilDestroyed())
			.subscribe((disabled) => this._selectService.updateDisable(disabled));

		toObservable(this.multiple)
			.pipe(takeUntilDestroyed())
			.subscribe((multiple) => this._selectService.updateMultiple(multiple));
	}

	ngOnInit(): void {
		// toObservable is too delayed, so setting these values here once to help initialize rest of the component
		this._selectService.updatePlaceholder(this.placeholder());
		this._selectService.updateMultiple(this.multiple());
		this._selectService.updateDir(this.dir());
	}

	public ngAfterContentInit(): void {
		// Check if Label Directive Provided and pass to service
		if (this.selectLabel()) {
			this.labelProvided.set(true);
			this._selectService.updateLabelId(this.selectLabel()?.id || '');
		} else if (this.placeholder()) {
			this._selectService.updateLabelId(`${this.id()}--label`);
		}
	}

	public toggle(): void {
		if (this.isExpanded()) {
			this.close();
		} else {
			this.open();
		}
	}

	public open(): void {
		if (!this._canOpen()) return;
		this._selectService.updateIsExpanded(true);
		this.openedChange.emit(true);
		this._moveFocusToCDKList();
	}

	public close(): void {
		if (!this.isExpanded()) return;

		if (this._selectService.selectTrigger) {
			this._selectService.selectTrigger.focus();
		}

		this.openedChange.emit(false);
		this._selectService.updateIsExpanded(false);
		this._onTouched();
	}

	protected _canOpen(): boolean {
		return !this.isExpanded() && !this.disabled() && this.options()?.length > 0;
	}

	private _moveFocusToCDKList(): void {
		setTimeout(() => this.selectContent()?.focusList());
	}

	public writeValue(value: any): void {
		// 'shouldEmitValueChange' ensures we don't propagate changes when we recieve value from from form control
		// set to false until next value change and then reset back to true
		this._shouldEmitValueChange.set(false);
		this._selectService.controlValue$.next(value);
	}

	public registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		this.disabled.set(isDisabled);
	}
}
