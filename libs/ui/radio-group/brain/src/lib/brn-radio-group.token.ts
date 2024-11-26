import { ExistingProvider, inject, InjectionToken, Type } from '@angular/core';
import type { BrnRadioGroupComponent } from './brn-radio-group.component';

const BrnRadioGroupToken = new InjectionToken<BrnRadioGroupComponent<unknown>>('BrnRadioGroupToken');

export function provideBrnRadioGroupToken<T>(component: Type<BrnRadioGroupComponent<T>>): ExistingProvider {
	return { provide: BrnRadioGroupToken, useExisting: component };
}

export function injectBrnRadioGroup<T = unknown>(): BrnRadioGroupComponent<T> {
	return inject(BrnRadioGroupToken) as BrnRadioGroupComponent<T>;
}
