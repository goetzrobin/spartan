import { InjectionToken } from '@angular/core';
import { BrnToggleDirective } from './brn-toggle.directive';

export const ToggleSyncable = new InjectionToken<ToggleSyncable>('@spartan-ng/ui/brain toggle syncable token');

export interface ToggleSyncable {
	_syncToggle(toggle: BrnToggleDirective, state: 'on' | 'off', isUserInput?: boolean, deferEvents?: boolean): void;
}
