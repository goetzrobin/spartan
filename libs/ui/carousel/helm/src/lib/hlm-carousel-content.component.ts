import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { HlmCarouselComponent } from './hlm-carousel.component';

@Component({
	selector: 'hlm-carousel-content',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
	`,
})
export class HlmCarouselContentComponent {
	private orientation = inject(HlmCarouselComponent).orientation;

	_userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('flex', this.orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', this._userClass()),
	);
}
