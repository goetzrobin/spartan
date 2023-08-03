import { InjectionToken } from '@angular/core';

export const ToggleGroupCanBeNullableProvider = new InjectionToken<ToggleGroupCanBeNullableProvider>(
  '@spartan-ng/ui/brain toggle group can be nullable token'
);

export interface ToggleGroupCanBeNullableProvider {
  _canBeNullable: (value: any) => boolean;
}
