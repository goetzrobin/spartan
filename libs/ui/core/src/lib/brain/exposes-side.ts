import { inject, InjectionToken, InjectOptions, Signal } from '@angular/core';

export interface ExposesSide {
	side: Signal<'top' | 'bottom' | 'left' | 'right'>;
}

export const EXPOSES_SIDE_TOKEN: InjectionToken<ExposesSide> = new InjectionToken<ExposesSide>(
	'@spartan-ng EXPOSES_SIDE_TOKEN',
);

export const injectExposedSideProvider = (options: InjectOptions) => inject(EXPOSES_SIDE_TOKEN, options);
