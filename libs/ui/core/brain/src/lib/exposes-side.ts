import { InjectionToken, Signal } from '@angular/core';

export interface ExposesSide {
  side: Signal<'top' | 'bottom' | 'left' | 'right'>;
}

export const EXPOSES_SIDE_TOKEN = new InjectionToken<ExposesSide>('@ng-spartan EXPOSES_SIDE_TOKEN');
