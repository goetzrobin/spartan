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
	ContentChild,
	ContentChildren,
	EventEmitter,
	Input,
	Output,
	type QueryList,
	type Signal,
	ViewChild,
	computed,
	inject,
	input,
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
export class BrnSelectComponent implements ControlValueAccessor, AfterContentInit, ExposesSide, ExposesState {
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
	@ContentChildren(BrnSelectOptionDirective, { descendants: true })
	protected options!: QueryList<BrnSelectOptionDirective>;
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

	constructor() {
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
		 * we dont propagate changes made from outside the component (ex. patch value or initial value from form control)
		 */
		toObservable(this._selectService.value)
			.subscribe((value) => {
				if (this._shouldEmitValueChange()) {
					this._onChange(value ?? null)
				}
				this._shouldEmitValueChange.set(true);
			});

		toObservable(this.dir).subscribe((dir) =>
			this._selectService.state.update((state) => ({ ...state, dir })),
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
		return !this.isExpanded() && !this._disabled() && this.options?.length > 0;
	}

	private _moveFocusToCDKList(): void {
		setTimeout(() => this.selectContent.focusList());
	}

	public writeValue(value: any): void {
		// 'shouldEmitValueChange' ensures we don't propagate changes when we receive value from form control
		// set to false until next value change and then reset back to true
		this._shouldEmitValueChange.set(false);
		this._selectService.setInitialSelectedOptions(value);
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
}
