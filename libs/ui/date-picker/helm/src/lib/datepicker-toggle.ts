/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
	AfterContentInit,
	Attribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	Directive,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewEncapsulation,
	booleanAttribute,
} from '@angular/core';
import { Observable, Subscription, merge, of as observableOf } from 'rxjs';
import { HlmDatepickerControl, HlmDatepickerPanel } from './datepicker-content';
import { HlmDatepickerIntl } from './datepicker-intl';

/** Can be used to override the icon of a `hlmDatepickerToggle`. */
@Directive({
	selector: '[hlmDatepickerToggleIcon]',
	standalone: true,
})
export class HlmDatepickerToggleIconDirective {}

@Component({
	selector: 'hlm-datepicker-toggle',
	templateUrl: './datepicker-toggle.html',
	host: {
		'[attr.tabindex]': 'null',
		'[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
		'[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
		'[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
		// Used by the test harness to tie this toggle to its datepicker.
		'[attr.data-mat-calendar]': 'datepicker ? datepicker.id : null',
		// Bind the `click` on the host, rather than the inner `button`, so that we can call
		// `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
		// it so that the input doesn't get focused automatically by the form field (See #21836).
		'(click)': '_open($event)',
	},
	exportAs: 'hlmDatepickerToggle',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class HlmDatepickerToggleComponent<D> implements AfterContentInit, OnChanges, OnDestroy {
	private _stateChanges = Subscription.EMPTY;

	/** Datepicker instance that the button will toggle. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @angular-eslint/no-input-rename
	@Input('for') datepicker!: HlmDatepickerPanel<HlmDatepickerControl<any>, D>;

	/** Tabindex for the toggle. */
	@Input() tabIndex: number | null;

	/** Screen-reader label for the button. */
	@Input('aria-label') ariaLabel!: string;

	/** Whether the toggle button is disabled. */
	@Input({ transform: booleanAttribute })
	get disabled(): boolean {
		if (this._disabled === undefined && this.datepicker) {
			return this.datepicker.disabled;
		}

		return !!this._disabled;
	}
	set disabled(value: boolean) {
		this._disabled = value;
	}
	private _disabled!: boolean;

	/** Whether ripples on the toggle should be disabled. */
	@Input() disableRipple!: boolean;

	/** Custom icon set by the consumer. */
	@ContentChild(HlmDatepickerToggleIconDirective) _customIcon!: HlmDatepickerToggleIconDirective;

	/** Underlying button element. */
	// @ViewChild('button') _button: HTMLButtonElement;

	constructor(
		public _intl: HlmDatepickerIntl,
		private _changeDetectorRef: ChangeDetectorRef,
		@Attribute('tabindex') defaultTabIndex: string,
	) {
		const parsedTabIndex = Number(defaultTabIndex);
		this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['datepicker']) {
			this._watchStateChanges();
		}
	}

	ngOnDestroy() {
		this._stateChanges.unsubscribe();
	}

	ngAfterContentInit() {
		this._watchStateChanges();
	}

	_open(event: Event): void {
		if (this.datepicker && !this.disabled) {
			this.datepicker.open();
			event.stopPropagation();
		}
	}

	private _watchStateChanges() {
		const datepickerStateChanged = this.datepicker ? this.datepicker.stateChanges : observableOf();
		const inputStateChanged =
			this.datepicker && this.datepicker.datepickerInput
				? this.datepicker.datepickerInput.stateChanges
				: observableOf();
		const datepickerToggled = this.datepicker
			? merge(this.datepicker.openedStream, this.datepicker.closedStream)
			: observableOf();

		this._stateChanges.unsubscribe();
		this._stateChanges = merge(
			this._intl.changes,
			datepickerStateChanged as Observable<void>,
			inputStateChanged,
			datepickerToggled,
		).subscribe(() => this._changeDetectorRef.markForCheck());
	}
}
