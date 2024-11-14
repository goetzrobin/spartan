import { Directive, HostListener } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/ui-date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: '[brnCalendarNextButton]',
	standalone: true,
	host: {
		type: 'button',
		'[attr.aria-label]': 'i18n.labelNext()',
	},
})
export class BrnCalendarNextButtonDirective {
	/** Access the calendar */
	private readonly calendar = injectBrnCalendar();

	/** Access the date adapter */
	private readonly dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly i18n = injectBrnCalendarI18n();

	/** Focus the previous month */
	@HostListener('click')
	protected focusPreviousMonth(): void {
		const targetDate = this.dateAdapter.add(this.calendar.state().focusedDate(), { months: 1 });

		// if the date is disabled, but there are available dates in the month, focus the last day of the month.
		const possibleDate = this.calendar.constrainDate(targetDate);

		if (this.dateAdapter.isSameMonth(possibleDate, targetDate)) {
			// if this date is within the same month, then focus it
			this.calendar.state().focusedDate.set(possibleDate);
			return;
		}

		this.calendar.state().focusedDate.set(targetDate);
	}
}
