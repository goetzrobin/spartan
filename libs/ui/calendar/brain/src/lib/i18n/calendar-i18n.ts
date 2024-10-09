import { InjectionToken, ValueProvider, inject } from '@angular/core';
import { BrnDateAdapter } from '@spartan-ng/ui-core';

export interface BrnCalendarI18n<T> {
	formatWeekdayName: (date: T, dateAdapter: BrnDateAdapter<T>) => string;
	formatHeader: (date: T, dateAdapter: BrnDateAdapter<T>) => string;
	labelPrevious: () => string;
	labelNext: () => string;
	labelWeekday: (date: T, dateAdapter: BrnDateAdapter<T>) => string;
}

export const BrnCalendarI18nToken = new InjectionToken<BrnCalendarI18n<unknown>>('BrnCalendarI18nToken');

/**
 * Provide the calendar i18n configuration.
 */
export function provideCalendarI18n<T>(configuration: BrnCalendarI18n<T>): ValueProvider {
	return { provide: BrnCalendarI18nToken, useValue: configuration };
}

const defaultCalendarI18n: BrnCalendarI18n<unknown> = {
	formatWeekdayName: (date: unknown, dateAdapter: BrnDateAdapter<unknown>) => {
		const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		return weekdays[dateAdapter.getDay(date)];
	},
	formatHeader: (date: unknown, dateAdapter: BrnDateAdapter<unknown>) => {
		return new Date(dateAdapter.getYear(date), dateAdapter.getMonth(date)).toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric',
		});
	},
	labelPrevious: () => 'Go to the previous month',
	labelNext: () => 'Go to the next month',
	labelWeekday: (date: unknown, dateAdapter: BrnDateAdapter<unknown>) => {
		const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return weekdays[dateAdapter.getDay(date)];
	},
};

/**
 * Inject the calendar i18n configuration.
 */
export function injectCalendarI18n<T>(): BrnCalendarI18n<T> {
	return inject(BrnCalendarI18nToken, { optional: true }) ?? defaultCalendarI18n;
}
