import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { BrnSliderTrackDirective } from "@spartan-ng/ui-slider-brain";
import { HlmSliderTrackInactiveDirective } from "./hlm-slider-track-inactive.directive";
import { HlmSliderTrackActiveDirective } from "./hlm-slider-track-active.directive";
import { HlmSliderTrackActiveFillDirective } from "./hlm-slider-track-active-fill.directive";
import { ClassValue } from "clsx";
import { hlm } from "@spartan-ng/ui-core";

@Component({
    selector: 'hlm-slider-track, brn-slider-track [hlm]',    
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-content></ng-content>
    <div hlmSliderTrackInactive></div> 
    <div hlmSliderTrackActive>           
        <div hlmSliderTrackActiveFill></div>
    </div>
    `,        
    host: {
		'[class]': '_computedClass()',
	},
    hostDirectives: [BrnSliderTrackDirective],
    imports: [HlmSliderTrackInactiveDirective, HlmSliderTrackActiveDirective, HlmSliderTrackActiveFillDirective]
})
export class HlmSliderTrackComponent {    
    public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'block h-full transition-all',
			this.userClass(),
		),
	);        
}