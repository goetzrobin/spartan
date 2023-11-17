import { inject, InjectionToken, InjectOptions, Signal } from '@angular/core';

export interface ExposesState {
	state: Signal<'open' | 'closed'>;
}

export const EXPOSES_STATE_TOKEN: InjectionToken<ExposesState> = new InjectionToken<ExposesState>(
	'@spartan-ng EXPOSES_STATE_TOKEN',
);

export const injectExposesStateProvider = (options: InjectOptions) => inject(EXPOSES_STATE_TOKEN, options);
