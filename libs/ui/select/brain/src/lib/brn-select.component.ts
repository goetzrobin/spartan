import { CdkListbox, CdkListboxModule } from '@angular/cdk/listbox';
import { CdkConnectedOverlay, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	ContentChildren,
	EventEmitter,
	Input,
	Output,
	QueryList,
	ViewChild,
	computed,
	inject,
	input,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
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
	providers: [BrnSelectService, CdkListbox],
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
			[cdkConnectedOverlayOpen]="isExpanded()"
			[cdkConnectedOverlayPositions]="_positions"
			[cdkConnectedOverlayWidth]="'auto'"
			(backdropClick)="close()"
			(detach)="close()"
		>
			<ng-content />
		</ng-template>
	`,
})
export class BrnSelectComponent implements ControlValueAccessor, AfterContentInit {
	private readonly _selectService = inject(BrnSelectService);

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'multiple' })
	set multiple(multiple: boolean) {
		this._selectService.state.update((state) => ({ ...state, multiple }));
	}
	protected readonly _multiple = this._selectService.multiple;

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'placeholder' })
	set placeholder(placeholder: string) {
		this._selectService.state.update((state) => ({ ...state, placeholder }));
	}
	protected readonly _placeholder = this._selectService.placeholder;

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'disabled' })
	set disabled(disabled: boolean) {
		this._selectService.state.update((state) => ({ ...state, disabled }));
	}
	protected readonly _disabled = this._selectService.disabled;

	dir = input<BrnReadDirection>('ltr');

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

	public readonly isExpanded = this._selectService.isExpanded;
	public readonly backupLabelId = computed(() => this._selectService.labelId());
	public readonly labelProvided = signal(false);
	public readonly value = signal('');

	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onChange: (value: unknown) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched = () => {};

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
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}

		// Watch for Listbox Selection Changes to trigger Collapse
		this._selectService.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe((listboxEvent) => {
			if (!this._multiple()) {
				this.close();
			}
			this.writeValue(listboxEvent.value);
			this._onChange(listboxEvent.value);
		});

		toObservable(this.dir)
			.pipe(takeUntilDestroyed())
			.subscribe(() =>
				this._selectService.state.update((state) => ({
					...state,
					dir: this.dir(),
				})),
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public writeValue(value: any): void {
		this.value.set(value);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}
}
