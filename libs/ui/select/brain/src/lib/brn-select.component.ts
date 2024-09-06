import { CdkListbox, CdkListboxModule, CdkOption } from '@angular/cdk/listbox';
import {
	CdkConnectedOverlay,
	OverlayModule,
	type ConnectedOverlayPositionChange,
	type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	computed,
	contentChildren,
	inject,
	input,
	signal,
	type AfterContentInit,
	type DoCheck,
	type Signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NgControl, NgForm, type ControlValueAccessor } from '@angular/forms';
import {
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
	type ExposesSide,
	type ExposesState,
} from '@spartan-ng/ui-core';
import { BrnFormFieldControl } from '@spartan-ng/ui-form-field-brain';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/ui-forms-brain';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { Subject, combineLatest, delay, map, of, switchMap } from 'rxjs';
import { BrnSelectContentComponent } from './brn-select-content.component';
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
		{
			provide: BrnFormFieldControl,
			useExisting: BrnSelectComponent,
		},
	],
	template: `
		@if (!labelProvided() && _placeholder()) {
			<label class="hidden" [attr.id]="backupLabelId()">{{ _placeholder() }}</label>
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
export class BrnSelectComponent
	implements ControlValueAccessor, AfterContentInit, DoCheck, ExposesSide, ExposesState, BrnFormFieldControl
{
	private readonly _selectService = inject(BrnSelectService);

	public readonly triggerWidth = this._selectService.triggerWidth;

	@Input({ alias: 'multiple' })
	set multiple(multiple: boolean) {
		this._selectService.state.update((state) => ({ ...state, multiple }));
	}
	protected readonly _multiple = this._selectService.multiple;

	@Input({ alias: 'placeholder' })
	set placeholder(placeholder: string) {
		this._selectService.state.update((state) => ({ ...state, placeholder }));
	}
	protected readonly _placeholder = this._selectService.placeholder;

	@Input({ alias: 'disabled' })
	set disabled(disabled: boolean) {
		this._selectService.state.update((state) => ({ ...state, disabled }));
	}
	protected readonly _disabled = this._selectService.disabled;

	public readonly dir = input<BrnReadDirection>('ltr');

	@ContentChild(BrnLabelDirective, { descendants: false })
	protected selectLabel!: BrnLabelDirective;
	/** Overlay pane containing the options. */
	@ContentChild(BrnSelectContentComponent)
	protected selectContent!: BrnSelectContentComponent;

	protected options = contentChildren(CdkOption, { descendants: true });
	protected options$ = toObservable(this.options);
	protected optionsAndIndex$ = this.options$.pipe(map((options, index) => [options, index] as const));

	/** Overlay pane containing the options. */
	@ViewChild(CdkConnectedOverlay)
	protected _overlayDir!: CdkConnectedOverlay;

	@Output()
	openedChange = new EventEmitter<boolean>();

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

	errorStateTracker: ErrorStateTracker;

	private defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private parentForm = inject(NgForm, { optional: true });
	private parentFormGroup = inject(FormGroupDirective, { optional: true });

	errorState = computed(() => this.errorStateTracker.errorState());

	writeValue$ = new Subject<any>();

	constructor() {
		this.handleOptionChanges();
		this.handleInitialOptionSelect();

		this._selectService.state.update((state) => ({
			...state,
			id: `brn-select-${nextId++}`,
		}));
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		// Watch for Listbox Selection Changes to trigger Collapse and Value Change
		this._selectService.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe(() => {
			if (!this._multiple()) {
				this.close();
			}

			// we set shouldEmitValueChange to true because we want to propagate the value change
			// as a result of user interaction
			this._shouldEmitValueChange.set(true);
		});

		/**
		 * Listening to value changes in order to trigger forms api on change
		 * ShouldEmitValueChange simply ensures we only propagate value change when a user makes a selection
		 * we don't propagate changes made from outside the component (ex. patch value or initial value from form control)
		 */
		toObservable(this._selectService.value).subscribe((value) => {
			if (this._shouldEmitValueChange()) {
				this._onChange(value ?? null);
			}
			this._shouldEmitValueChange.set(true);
		});

		toObservable(this.dir).subscribe((dir) => this._selectService.state.update((state) => ({ ...state, dir })));

		this.errorStateTracker = new ErrorStateTracker(
			this.defaultErrorStateMatcher,
			this.ngControl,
			this.parentFormGroup,
			this.parentForm,
		);
	}

	public ngAfterContentInit(): void {
		// Check if Label Directive Provided and pass to service
		if (this.selectLabel) {
			this.labelProvided.set(true);
			this._selectService.state.update((state) => ({
				...state,
				labelId: this.selectLabel.id,
				dir: this.dir(),
			}));
		} else if (this._placeholder()) {
			this._selectService.state.update((state) => ({
				...state,
				labelId: `${state.id}--label`,
				dir: this.dir(),
			}));
		}
	}

	ngDoCheck() {
		this.errorStateTracker.updateErrorState();
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
		this._selectService.state.update((state) => ({
			...state,
			isExpanded: true,
		}));
		this.openedChange.next(true);
		this._moveFocusToCDKList();
	}

	public close(): void {
		if (!this.isExpanded()) return;

		if (this._selectService.selectTrigger) {
			this._selectService.selectTrigger.focus();
		}

		this.openedChange.next(false);
		this._selectService.state.update((state) => ({
			...state,
			isExpanded: false,
		}));
		this._onTouched();
	}

	protected _canOpen(): boolean {
		return !this.isExpanded() && !this._disabled() && this.options()?.length > 0;
	}

	private _moveFocusToCDKList(): void {
		setTimeout(() => this.selectContent.focusList());
	}

	public writeValue(value: any): void {
		this.writeValue$.next(value);
	}

	public registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
	}

	/**
	 * Once writeValue is called and options are available we can handle setting the initial options
	 * @private
	 */
	private handleInitialOptionSelect() {
		// Write value cannot be handled until options are available, so we wait until both are available with a combineLatest
		combineLatest([this.writeValue$, this.options$])
			.pipe(
				map((values, index) => [...values, index]),
				takeUntilDestroyed(),
			)
			.subscribe(([value, initialOptions, index]) => {
				this._shouldEmitValueChange.set(false);
				this._selectService.setInitialSelectedOptions(value);
				// the first time this observable emits a value we are simply setting the initial state
				// this change should not count as changing the state of the select, so we need to mark as pristine
				if (index === 0) {
					this.ngControl?.control?.markAsPristine();
				}
			});
	}

	/**
	 * When options change, our current selected options may become invalid
	 * Here we will automatically update our current selected options so that they are always inline with the possibleOptions
	 * @private
	 */
	private handleOptionChanges() {
		this.optionsAndIndex$.pipe(takeUntilDestroyed()).subscribe(([options, index]) => {
			if (index > 0) {
				this.handleInvalidOptions(options);
			}
			this.updatePossibleOptions(options);
		});
	}

	/**
	 * Check that our "selectedOptions" are still valid when "possibleOptions" is about to be updated
	 */
	private handleInvalidOptions(options: readonly CdkOption[]) {
		const selectedOptions = this._selectService.selectedOptions();
		const availableOptionSet = new Set<CdkOption | null>(options);
		if (this._selectService.multiple()) {
			const filteredOptions = selectedOptions.filter((o) => availableOptionSet.has(o));
			// only update if there was an actual change
			if (selectedOptions.length !== filteredOptions.length) {
				// update should result in a value change since we are deselecting a value
				this._shouldEmitValueChange.set(true);
				const value = filteredOptions.map((o) => (o?.value as string) ?? '');
				this._selectService.state.update((state) => ({
					...state,
					selectedOptions: filteredOptions,
					value: value,
				}));
				this._onChange(value ?? null);
			}
		} else {
			const selectedOption = selectedOptions[0] ?? null;
			if (selectedOption !== null && !availableOptionSet.has(selectedOption)) {
				this._shouldEmitValueChange.set(true);
				this._selectService.state.update((state) => ({
					...state,
					selectedOptions: [],
					value: '',
				}));
				this._onChange('');
			}
		}
	}

	/**
	 * Sync the updated options with "possibleOptions" in the select service
	 */
	private updatePossibleOptions(options: readonly CdkOption[]) {
		this._selectService.state.update((state) => ({
			...state,
			possibleOptions: options as CdkOption[],
		}));
	}
}
