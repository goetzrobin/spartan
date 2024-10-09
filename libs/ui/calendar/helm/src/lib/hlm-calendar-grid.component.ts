import { Component, computed } from '@angular/core';
import { injectCalendarI18n } from '@spartan-ng/ui-calendar-brain';
import { injectDateAdapter } from '@spartan-ng/ui-core';
import { HlmCalendarCellComponent } from './hlm-calendar-cell.component';
import { injectCalendar } from './hlm-calendar.token';

@Component({
	standalone: true,
	selector: 'hlm-calendar-grid',
	imports: [HlmCalendarCellComponent],
	template: `
		<table class="w-full border-collapse space-y-1" role="grid" [attr.aria-labelledby]="calendar.header().id">
			<thead>
				<tr class="flex">
					@for (day of weekdays(); track dateAdapter.getTime(day)) {
						<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" [attr.aria-label]="i18n.labelWeekday(day, dateAdapter)">
							{{ i18n.formatWeekdayName(day, dateAdapter) }}
						</th>
					}
				</tr>
			</thead>

			<tbody role="rowgroup">
				@for (week of weeks(); track dateAdapter.getTime(week[0])) {
				<tr class="flex w-full mt-2">
					@for (date of week; track dateAdapter.getTime(date)) {
					<td hlm-calendar-cell [date]="date"></td>
					}
				</tr>
				}
			</tbody>
		</table>
	`,
})
export class HlmCalendarGridComponent<T> {
	/** Access the date adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** Access the calendar component */
	protected readonly calendar = injectCalendar<T>();

	/** Access the calendar i18n */
	protected readonly i18n = injectCalendarI18n<T>();

	/**
	 * Get the days of the week to display in the header.
	 */
	protected readonly weekdays = computed(() => {
		// get the first 7 days of the week.
		return this.days().slice(0, 7);
	});

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	protected readonly days = computed(() => {
		const weekStartsOn = this.calendar.weekStartsOn();
		const month = this.calendar.state().focusedDate();
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

	// get the weeks to display.
	protected readonly weeks = computed(() => {
		const days = this.days();
		const weeks = [];

		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return weeks;
	});
}
