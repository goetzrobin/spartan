import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { HlmCalendarComponent } from './hlm-calendar.component';

export const HlmCalendarToken = new InjectionToken<HlmCalendarComponent<unknown>>('HlmCalendarToken');

export function provideCalendar<T>(instance: Type<HlmCalendarComponent<T>>): ExistingProvider {
	return { provide: HlmCalendarToken, useExisting: instance };
}

/**
 * Inject the calendar component.
 */
export function injectCalendar<T>(): HlmCalendarComponent<T> {
	return inject(HlmCalendarToken) as HlmCalendarComponent<T>;
}
