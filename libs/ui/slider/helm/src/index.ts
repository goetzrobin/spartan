import { HlmSliderInputDirective } from "./lib/hlm-slider-input.directive";
import { HlmSliderThumbComponent } from "./lib/hlm-slider-thumb.component";
import { HlmSliderTrackComponent } from "./lib/hlm-slider-track.component";
import { HlmSliderComponent } from "./lib/hlm-slider.component";

export const HlmSliderImports = [
	HlmSliderComponent,	
    HlmSliderTrackComponent,
    HlmSliderInputDirective,    
    HlmSliderThumbComponent
] as const;
