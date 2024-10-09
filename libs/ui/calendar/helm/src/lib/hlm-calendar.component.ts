import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	booleanAttribute,
	computed,
	inject,
	input,
	model,
	signal,
	viewChild,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/ui-core';
import type { HlmCalendarCellComponent } from './hlm-calendar-cell.component';
import { HlmCalendarGridComponent } from './hlm-calendar-grid.component';
import { HlmCalendarHeaderComponent } from './hlm-calendar-header.component';
import { HlmCalendarHeaderToken } from './hlm-calendar-header.token';
import { provideCalendar } from './hlm-calendar.token';

@Component({
	standalone: true,
	selector: 'hlm-calendar',
	imports: [NgClass, HlmCalendarHeaderComponent, HlmCalendarGridComponent],
	viewProviders: [provideCalendar(HlmCalendarComponent)],
	template: `
		<div class="p-3 rounded-md border">
			<div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
				<hlm-calendar-header />
				<hlm-calendar-grid />
			</div>
		</div>
	`,
})
export class HlmCalendarComponent<T> {
	/** Access the date adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** Access the change detector */
	private readonly changeDetector = inject(ChangeDetectorRef);

	/** The minimum date that can be selected.*/
	readonly min = input<T | undefined>(undefined);

	/* * The maximum date that can be selected. */
	readonly max = input<T | undefined>(undefined);

	/** Determine if the date picker is disabled. */
	readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	readonly date = model<T | undefined>();

	/** Whether a specific date is disabled. */
	readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The default focused date. */
	readonly defaultFocusedDate = input<T>();

	/** @internal Access the header */
	readonly header = viewChild.required(HlmCalendarHeaderToken);

	/** Store the cells */
	private readonly cells = signal<HlmCalendarCellComponent<T>[]>([]);

	/**
	 * @internal
	 * The internal state of the component.
	 */
	readonly state = computed(() => ({
		focusedDate: signal(this.constrainDate(this.defaultFocusedDate() ?? this.date() ?? this.dateAdapter.now())),
	}));

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	protected readonly days = computed(() => {
		const month = this.state().focusedDate();
		const days: T[] = [];

		// Get the first and last day of the month.
		let firstDay = this.dateAdapter.startOfMonth(month);
		let lastDay = this.dateAdapter.endOfMonth(month);

		// find the first and last day of visible in the grid.
		firstDay = this.dateAdapter.subtract(firstDay, {
			days: this.dateAdapter.getDay(firstDay),
		});
		lastDay = this.dateAdapter.add(lastDay, {
			days: 6 - this.dateAdapter.getDay(lastDay),
		});

		// collect all the days to display.
		while (firstDay <= lastDay) {
			days.push(firstDay);
			firstDay = this.dateAdapter.add(firstDay, { days: 1 });
		}

		return days;
	});

	// get the weeks to display.
	protected readonly weeks = computed(() => {
		const days = this.days();
		const weeks = [];

		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return weeks;
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

		// we must update the view to ensure the focused cell is visible.
		this.changeDetector.detectChanges();

		// focus the cell with the target date.
		const cell = this.cells().find((c) => this.dateAdapter.isSameDay(c.date(), date));

		if (cell) {
			cell.focus();
		}
	}

	/** @internal Register a cell */
	registerCell(cell: HlmCalendarCellComponent<T>): void {
		this.cells.update((cells) => [...cells, cell]);
	}

	/** @internal Unregister a cell */
	unregisterCell(cell: HlmCalendarCellComponent<T>): void {
		this.cells.update((cells) => cells.filter((c) => c !== cell));
	}
}
