import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { hlm } from "@spartan-ng/ui-core";
import { BrnSliderDirective } from "@spartan-ng/ui-slider-brain";
import type { ClassValue } from "clsx";

@Component({
	selector: 'hlm-slider, brn-slider [hlm]',
	standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnSliderDirective,
			inputs: ['brnSliderDisabled: disabled', 'min', 'max'],			
		},
	],
	template: '<ng-content/>',
    host: {
		'[class]': '_computedClass()',
	},	
})
export class HlmSliderComponent {	
    public readonly disabled = input<boolean>();
	public readonly min = input<number>();
	public readonly max = input<number>();

    public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'w-full h-4 block relative',
			this.userClass(),
			this._brnSlider.disabled() ? 'opacity-40' : ''
		),
	);

	private readonly _brnSlider = inject(BrnSliderDirective, { host: true });	
}