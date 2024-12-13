import { InjectionToken, ValueProvider, inject } from '@angular/core';
import { type IconType } from '@ng-icons/core';
import type { IconSize } from './hlm-icon.component';

export interface HlmIconConfig {
	name: IconType;
	size: IconSize;
}

const defaultConfig: HlmIconConfig = {
	name: '',
	size: 'base',
};

const HlmIconConfigToken = new InjectionToken<HlmIconConfig>('HlmIconConfig');

export function provideHlmIconConfig(config: Partial<HlmIconConfig>): ValueProvider {
	return { provide: HlmIconConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmIconConfig(): HlmIconConfig {
	return inject(HlmIconConfigToken, { optional: true }) ?? defaultConfig;
}
