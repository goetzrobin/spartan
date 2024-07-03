import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';
import { HlmCarouselComponent } from './hlm-carousel.component';

@Component({
	selector: 'hlm-carousel-item',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
		role: 'group',
		'aria-roledescription': 'slide',
	},
	template: `
		<ng-content />
	`,
})
export class HlmCarouselItemComponent {
	_userClass = input<ClassValue>('', { alias: 'class' });
	private orientation = inject(HlmCarouselComponent).orientation;
	protected _computedClass = computed(() =>
		hlm('min-w-0 shrink-0 grow-0 basis-full', this.orientation() === 'horizontal' ? 'pl-4' : 'pt-4', this._userClass()),
	);
}
