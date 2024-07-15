import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { hlm } from "@spartan-ng/ui-core";
import { BRN_SLIDER, BrnSliderThumbDirective } from "@spartan-ng/ui-slider-brain";
import type { ClassValue } from "clsx";

@Component({
	selector: 'hlm-slider-thumb, brn-slider-thumb [hlm]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ``,
	host: {
		'[class]': '_computedClass()',
		'[attr.dir]': '_direction()',
	},
	hostDirectives: [BrnSliderThumbDirective],
})
export class HlmSliderThumbComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'-translate-y-1/2 h-6 w-6 absolute rounded-full top-1/2 ltr:-left-3 rtl:-right-3 bg-primary cursor-pointer pointer-events-none transition-all',
			this._brnSlider.brnSliderTrack()?.brnSliderInput()?.isFocused() ? 'ring-2 ring-gray-400' : '',
			this.userClass(),
		),
	);
	protected _direction = computed(() => this._brnSlider.direction());

	private readonly _brnSlider = inject(BRN_SLIDER);
}