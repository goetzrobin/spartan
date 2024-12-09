import { BrnSliderThumbDirective } from './lib/brn-slider-thumb.directive';
import { BrnSliderDirective, BrnSliderInputDirective, BrnSliderTrackDirective } from './lib/brn-slider-track.directive';

export * from './lib/brn-slider-thumb.directive';
export * from './lib/brn-slider-tick-mark.directive';
export * from './lib/brn-slider-track-active-fill.directive';
export * from './lib/brn-slider-track.directive';

export const BrnSliderImports = [
	BrnSliderDirective,
	BrnSliderTrackDirective,
	BrnSliderInputDirective,
	BrnSliderThumbDirective,
] as const;
