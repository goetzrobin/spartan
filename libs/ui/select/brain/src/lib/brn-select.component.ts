import { CdkListbox, CdkListboxModule } from '@angular/cdk/listbox';
import { CdkConnectedOverlay, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	ContentChildren,
	Input,
	OnInit,
	QueryList,
	ViewChild,
	booleanAttribute,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { map, tap } from 'rxjs';
import { BrnSelectContentDirective } from './brn-select-content.directive';
import { BrnSelectOptionDirective } from './brn-select-option.directive';
import { BrnSelectTriggerDirective } from './brn-select-trigger.directive';
import { BrnSelectService } from './brn-select.service';
let nextId = 0;

@Component({
	selector: 'brn-select',
	standalone: true,
	imports: [OverlayModule, BrnSelectTriggerDirective, CdkListboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [BrnSelectService, CdkListbox],
	host: {
		class: 'inline-block',
	},
	template: `
		<!-- Select -->
		@if (!labelProvided() && placeholder) {
			<label class="hidden" [id]="backupLabelId()">{{ placeholder }}</label>
		}
		<ng-content select="brn-label"></ng-content>
		<div cdk-overlay-origin (click)="toggle()" #fallbackOverlayOrigin="cdkOverlayOrigin" #trigger>
			<ng-content select="brn-select-trigger"></ng-content>
			<ng-content select="hlm-select-trigger"></ng-content>
		</div>
		<ng-template
			cdk-connected-overlay
			cdkConnectedOverlayLockPosition
			cdkConnectedOverlayHasBackdrop
			cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
			[cdkConnectedOverlayOrigin]="fallbackOverlayOrigin"
			[cdkConnectedOverlayOpen]="isExpanded()"
			[cdkConnectedOverlayPositions]="_positions"
			[cdkConnectedOverlayWidth]="'auto'"
			(backdropClick)="close()"
			(detach)="close()"
		>
			<ng-content></ng-content>
		</ng-template>
	`,
})
export class BrnSelectComponent implements OnInit, ControlValueAccessor, AfterContentInit {
	value = signal('');

	ngControl = inject(NgControl);

	@Input() multiple = false;

	@Input() placeholder: string = '';

	/** Whether the select is disabled. */
	@Input({ transform: booleanAttribute })
	set disabled(disabled: boolean) {
		this._disabled = disabled;
		this._selectService.state.update((state) => ({ ...state, disabled }));
	}
	_disabled: boolean = false;

	@ContentChild(BrnLabelDirective)
	protected selectLabel!: BrnLabelDirective;

	@ContentChild(BrnSelectTriggerDirective)
	protected selectTrigger!: BrnSelectTriggerDirective;

	/** Overlay pane containing the options. */
	@ContentChild(BrnSelectContentDirective)
	protected selectContent!: BrnSelectContentDirective;

	@ContentChildren(BrnSelectOptionDirective, { descendants: true })
	options!: QueryList<BrnSelectOptionDirective>;

	/** Overlay pane containing the options. */
	@ViewChild(CdkConnectedOverlay)
	protected _overlayDir!: CdkConnectedOverlay;

	private _selectService = inject(BrnSelectService);

	isExpanded = this._selectService.isExpanded;

	backupLabelId = this._selectService.labelId;

	labelProvided = signal(false);

	/*
	 * This position config ensures that the top "start" corner of the overlay
	 * is aligned with with the top "start" of the origin by default (overlapping
	 * the trigger completely). If the panel cannot fit below the trigger, it
	 * will fall back to a position above the trigger.
	 */
	_positions: ConnectedPosition[] = [
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
			panelClass: 'mat-mdc-select-panel-above',
		},
		{
			originX: 'end',
			originY: 'top',
			overlayX: 'end',
			overlayY: 'bottom',
			panelClass: 'mat-mdc-select-panel-above',
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
		this._selectService.listBoxValueChangeEvent$
			.pipe(
				tap(() => !this.multiple && this.close()),
				map((listboxEvent) => {
					console.log(listboxEvent);
					this.writeValue(listboxEvent.value);
					this.onChange(listboxEvent.value);
				}),
				takeUntilDestroyed(),
			)
			.subscribe();
	}

	ngOnInit(): void {
		this._selectService.state.update((state) => ({
			...state,
			multiple: this.multiple,
			placeholder: this.placeholder,
		}));
	}

	ngAfterContentInit(): void {
		// Check if Label Directive Provided and pass to service
		if (this.selectLabel) {
			this.labelProvided.set(true);
			this._selectService.state.update((state) => ({
				...state,
				labelId: this.selectLabel.id,
			}));
		} else if (this.placeholder) {
			this._selectService.state.update((state) => ({
				...state,
				labelId: `${state.id}--label`,
			}));
		}
	}

	/** Toggles the overlay panel open or closed. */
	toggle(): void {
		this.isExpanded() ? this.close() : this.open();
	}

	/** Opens the overlay panel. */
	open(): void {
		if (this._canOpen()) {
			this._selectService.state.update((state) => ({
				...state,
				isExpanded: true,
			}));
			this._moveFocusToCDKList();
		}
	}

	/** Closes the overlay panel and focuses the host element. */
	close(): void {
		if (this.isExpanded()) {
			if (this.selectTrigger) {
				this.selectTrigger.focus();
			}

			this._selectService.state.update((state) => ({
				...state,
				isExpanded: false,
			}));
			this.onTouched();
		}
	}

	/** Whether the panel is allowed to open. */
	protected _canOpen(): boolean {
		return !this.isExpanded() && !this._disabled && this.options?.length > 0;
	}

	private _moveFocusToCDKList(): void {
		setTimeout(() => this.selectContent.focusList());
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange!: (value: any) => void;

	onTouched!: () => void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	writeValue(value: any): void {
		this.value.set(value);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
