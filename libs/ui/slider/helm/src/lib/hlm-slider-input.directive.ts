import { Directive, computed, input } from "@angular/core";
import { hlm } from "@spartan-ng/ui-core";
import { BrnSliderInputDirective } from "@spartan-ng/ui-slider-brain";
import type { ClassValue } from "clsx";

@Directive({
    selector: 'input[hlmSliderInput], input[brnSliderInput]',    
    standalone: true,      
    hostDirectives: [BrnSliderInputDirective],
    host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderInputDirective {

    public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'w-full h-full opacity-0 absolute cursor-pointer transition-all',
			this.userClass(),
		),
	);
}