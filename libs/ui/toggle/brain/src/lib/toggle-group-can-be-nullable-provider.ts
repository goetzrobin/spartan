import { InjectionToken } from '@angular/core';

export const ToggleGroupCanBeNullableProvider = new InjectionToken<ToggleGroupCanBeNullableProvider>(
	'@spartan-ng/ui/brain toggle group can be nullable token',
);

export interface ToggleGroupCanBeNullableProvider {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_canBeNullable: (value: any) => boolean;
}
