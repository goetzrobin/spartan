import { InjectionToken, Signal } from '@angular/core';

export interface ExposesState {
  state: Signal<'open' | 'closed'>;
}

export const EXPOSES_STATE_TOKEN = new InjectionToken<ExposesState>('@ng-spartan EXPOSES_STATE_TOKEN');
