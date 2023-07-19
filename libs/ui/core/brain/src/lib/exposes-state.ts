import { InjectionToken, Signal } from '@angular/core';

export interface ExposesState {
  state: Signal<'open' | 'closed'>;
}

export const EXPOSES_STATE_TOKEN = new InjectionToken<ExposesState>('@spartan-ng EXPOSES_STATE_TOKEN');
