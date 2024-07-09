import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { BrnSliderThumbDirective } from "@spartan-ng/ui-slider-brain";
import { ClassValue } from "clsx";
import { hlm } from "@spartan-ng/ui-core";

@Component({
    selector: 'hlm-slider-thumb, brn-slider-thumb [hlm]',    
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ``,        
    host: {
		'[class]': '_computedClass()',
	},
    hostDirectives: [BrnSliderThumbDirective],
})
export class HlmSliderThumbComponent {    
    public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'-translate-y-1/2 h-6 w-6 absolute rounded-full top-1/2 -left-3 bg-primary cursor-pointer pointer-events-none transition-all',
			this.userClass(),
		),
	);        
}