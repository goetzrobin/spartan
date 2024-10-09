import { ExistingProvider, InjectionToken, Type, inject } from '@angular/core';
import type { HlmCalendarHeaderComponent } from './hlm-calendar-header.component';

export const HlmCalendarHeaderToken = new InjectionToken<HlmCalendarHeaderComponent<unknown>>('HlmCalendarHeaderToken');

export function provideCalendarHeader<T>(instance: Type<HlmCalendarHeaderComponent<T>>): ExistingProvider {
	return { provide: HlmCalendarHeaderToken, useExisting: instance };
}

/**
 * Inject the calendar header component.
 */
export function injectCalendarHeader<T>(): HlmCalendarHeaderComponent<T> {
	return inject(HlmCalendarHeaderToken) as HlmCalendarHeaderComponent<T>;
}
