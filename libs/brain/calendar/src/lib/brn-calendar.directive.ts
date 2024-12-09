import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	ChangeDetectorRef,
	Directive,
	Injector,
	afterNextRender,
	booleanAttribute,
	computed,
	contentChild,
	contentChildren,
	inject,
	input,
	model,
	numberAttribute,
	signal,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnCalendarCellButtonDirective } from './brn-calendar-cell-button.directive';
import { BrnCalendarHeaderDirective } from './brn-calendar-header.directive';
import { provideBrnCalendar } from './brn-calendar.token';

@Directive({
	selector: '[brnCalendar]',
	standalone: true,
	providers: [provideBrnCalendar(BrnCalendarDirective)],
})
export class BrnCalendarDirective<T> {
	/** Access the date adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the injector */
	private readonly _injector = inject(Injector);

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/* * The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput>(0, {
		transform: (v: unknown) => numberAttribute(v) as Weekday,
	});

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** @internal Access the header */
	public readonly header = contentChild(BrnCalendarHeaderDirective);

	/** Store the cells */
	protected readonly cells = contentChildren<BrnCalendarCellButtonDirective<T>>(BrnCalendarCellButtonDirective, {
		descendants: true,
	});

	/**
	 * @internal
	 * The internal state of the component.
	 */
	public readonly state = computed(() => ({
		focusedDate: signal(this.constrainDate(this.defaultFocusedDate() ?? this.date() ?? this.dateAdapter.now())),
	}));

	/**
	 * The focused date.
	 */
	public readonly focusedDate = computed(() => this.state().focusedDate());

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	public readonly days = computed(() => {
		const weekStartsOn = this.weekStartsOn();
		const month = this.state().focusedDate();
		const days: T[] = [];

		// Get the first and last day of the month.
		let firstDay = this.dateAdapter.startOfMonth(month);
		let lastDay = this.dateAdapter.endOfMonth(month);

		// we need to subtract until we get the to starting day before or on the start of the month.
		while (this.dateAdapter.getDay(firstDay) !== weekStartsOn) {
			firstDay = this.dateAdapter.subtract(firstDay, { days: 1 });
		}

		const weekEndsOn = (weekStartsOn + 6) % 7;

		// we need to add until we get to the ending day after or on the end of the month.
		while (this.dateAdapter.getDay(lastDay) !== weekEndsOn) {
			lastDay = this.dateAdapter.add(lastDay, { days: 1 });
		}

		// collect all the days to display.
		while (firstDay <= lastDay) {
			days.push(firstDay);
			firstDay = this.dateAdapter.add(firstDay, { days: 1 });
		}

		return days;
	});

	/** @internal Constrain a date to the min and max boundaries */
	constrainDate(date: T): T {
		const min = this.min();
		const max = this.max();

		// If there is no min or max, return the date.
		if (!min && !max) {
			return date;
		}

		// If there is a min and the date is before the min, return the min.
		if (min && this.dateAdapter.isBefore(date, this.dateAdapter.startOfDay(min))) {
			return min;
		}

		// If there is a max and the date is after the max, return the max.
		if (max && this.dateAdapter.isAfter(date, this.dateAdapter.endOfDay(max))) {
			return max;
		}

		// Return the date.
		return date;
	}

	/** @internal Determine if a date is disabled */
	isDateDisabled(date: T): boolean {
		// if the calendar is disabled we can't select this date
		if (this.disabled()) {
			return true;
		}

		// if the date is outside the min and max range
		const min = this.min();
		const max = this.max();

		if (min && this.dateAdapter.isBefore(date, this.dateAdapter.startOfDay(min))) {
			return true;
		}

		if (max && this.dateAdapter.isAfter(date, this.dateAdapter.endOfDay(max))) {
			return true;
		}

		// if this specific date is disabled
		const disabledFn = this.dateDisabled();

		if (disabledFn(date)) {
			return true;
		}

		return false;
	}

	selectDate(date: T): void {
		this.date.set(date);
		this.state().focusedDate.set(date);
	}

	/** @internal Set the focused date */
	setFocusedDate(date: T): void {
		// check if the date is disabled.
		if (this.isDateDisabled(date)) {
			return;
		}

		this.state().focusedDate.set(date);

		// wait until the cells have all updated
		afterNextRender(
			{
				write: () => {
					// focus the cell with the target date.
					const cell = this.cells().find((c) => this.dateAdapter.isSameDay(c.date(), date));

					if (cell) {
						cell.focus();
					}
				},
			},
			{
				injector: this._injector,
			},
		);

		// we must update the view to ensure the focused cell is visible.
		this._changeDetector.detectChanges();
	}
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
