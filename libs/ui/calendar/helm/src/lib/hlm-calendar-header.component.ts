import { Component, computed } from '@angular/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { injectCalendarI18n } from '@spartan-ng/ui-calendar-brain';
import { injectDateAdapter } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { provideCalendarHeader } from './hlm-calendar-header.token';
import { injectCalendar } from './hlm-calendar.token';

let uniqueId = 0;

@Component({
	standalone: true,
	selector: 'hlm-calendar-header',
	imports: [HlmIconComponent],
	providers: [provideCalendarHeader(HlmCalendarHeaderComponent)],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
		<div class="space-y-4">
			<div class="flex justify-center pt-1 relative items-center">

				<div class="text-sm font-medium" aria-live="polite" role="presentation" [id]="id">
					{{ heading() }}
				</div>

				<div class="space-x-1 flex items-center">
					<button [attr.aria-label]="i18n.labelPrevious()" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1" type="button" (click)="focusPreviousMonth()">
						<hlm-icon name="lucideChevronLeft" class="size-4" />
					</button>

					<button [attr.aria-label]="i18n.labelNext()" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1" type="button" (click)="focusNextMonth()">
						<hlm-icon name="lucideChevronRight" class="size-4" />
					</button>
				</div>

			</div>
		</div>
	`,
})
export class HlmCalendarHeaderComponent<T> {
	/** Access the calendar component. */
	protected readonly calendar = injectCalendar<T>();

	/** Access the date adapter. */
	private readonly dateAdapter = injectDateAdapter<T>();

	/** Access the calendar i18n */
	protected readonly i18n = injectCalendarI18n<T>();

	/** The unique id for the header */
	readonly id = `hlm-calendar-header-${uniqueId++}`;

	/** Get the heading for the current month and year */
	protected heading = computed(() => this.i18n.formatHeader(this.calendar.state().focusedDate(), this.dateAdapter));

	/** Focus the previous month */
	protected focusPreviousMonth(): void {
		const targetDate = this.dateAdapter.subtract(this.calendar.state().focusedDate(), { months: 1 });
		this.attemptFocusDate(targetDate);
	}

	/** Focus the next month */
	protected focusNextMonth(): void {
		const targetDate = this.dateAdapter.add(this.calendar.state().focusedDate(), { months: 1 });
		this.attemptFocusDate(targetDate);
	}

	private attemptFocusDate(targetDate: T): void {
		// if the date is disabled, but there are available dates in the month, focus the last day of the month.
		const possibleDate = this.calendar.constrainDate(targetDate);

		// if this date is within the same month, then focus it
		if (this.dateAdapter.isSameMonth(possibleDate, targetDate)) {
			this.calendar.state().focusedDate.set(possibleDate);
			return;
		}

		this.calendar.state().focusedDate.set(targetDate);
	}
}
