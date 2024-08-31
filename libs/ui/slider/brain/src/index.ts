import { BrnSliderInputDirective } from './lib/brn-slider-input.directive';
import { BrnSliderThumbDirective } from './lib/brn-slider-thumb.directive';
import { BrnSliderTrackDirective } from './lib/brn-slider-track.directive';
import { BrnSliderDirective } from './lib/brn-slider.directive';

export * from './lib/brn-slider-input.directive';
export * from './lib/brn-slider-thumb.directive';
export * from './lib/brn-slider-tick-mark.directive';
export * from './lib/brn-slider-track-active-fill.directive';
export * from './lib/brn-slider-track.directive';
export * from './lib/brn-slider.directive';

export const BrnSliderImports = [
	BrnSliderDirective,
	BrnSliderTrackDirective,
	BrnSliderInputDirective,
	BrnSliderThumbDirective,
] as const;
