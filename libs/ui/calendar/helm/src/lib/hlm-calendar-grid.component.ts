import { Component, computed } from '@angular/core';
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
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Sunday">Su</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Monday">Mo</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Tuesday">Tu</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Wednesday">We</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Thursday">Th</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Friday">Fr</th>
					<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="Saturday">Sa</th>
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

	/**
	 * Get all the days to display, this is the days of the current month
	 * and the days of the previous and next month to fill the grid.
	 */
	protected readonly days = computed(() => {
		const month = this.calendar.state().focusedDate();
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
}
