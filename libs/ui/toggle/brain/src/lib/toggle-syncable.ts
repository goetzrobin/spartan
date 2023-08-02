import { BrnToggleDirective } from './brn-toggle.directive';
import { InjectionToken } from '@angular/core';

export const ToggleSyncable = new InjectionToken<ToggleSyncable>('@spartan-ng/ui/brain toggle syncable token');

export interface ToggleSyncable {
  _syncToggle(toggle: BrnToggleDirective, state: 'on' | 'off', isUserInput?: boolean, deferEvents?: boolean): void;
}
