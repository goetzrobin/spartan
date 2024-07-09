import { Directive, computed, input } from "@angular/core";
import { hlm } from "@spartan-ng/ui-core";
import { BrnSliderTrackActiveFillDirective } from "@spartan-ng/ui-slider-brain";
import { ClassValue } from "clsx";

@Directive({
    selector: '[hlmSliderTrackActiveFill]',    
    standalone: true,      
    hostDirectives: [BrnSliderTrackActiveFillDirective],
    host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderTrackActiveFillDirective {

    public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'h-full w-full absolute top-0 pointer-events-none bg-primary origin-left transition-all scale-x-0',
			this.userClass(),
		),
	);
}