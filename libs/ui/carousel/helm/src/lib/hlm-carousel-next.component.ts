import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
	computed,
	effect,
	inject,
	input,
	untracked,
} from '@angular/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';
import { HlmCarouselComponent } from './hlm-carousel.component';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[hlm-carousel-next], button[hlmCarouselNext]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[disabled]': 'isDisabled()',
		'(click)': 'carousel.scrollNext()',
	},
	hostDirectives: [{ directive: HlmButtonDirective, inputs: ['variant', 'size'] }],
	providers: [provideIcons({ lucideArrowRight })],
	imports: [HlmIconComponent],
	template: `
		<hlm-icon size="sm" name="lucideArrowRight" />
		<span class="sr-only">Next slide</span>
	`,
})
export class HlmCarouselNextComponent {
	protected carousel = inject(HlmCarouselComponent);
	_userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'absolute h-8 w-8 rounded-full',
			this.carousel.orientation() === 'horizontal'
				? '-right-12 top-1/2 -translate-y-1/2'
				: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
			this._userClass(),
		),
	);
	protected isDisabled = () => !this.carousel.canScrollNext();

	constructor() {
		const button = inject(HlmButtonDirective);

		button.variant = 'outline';
		button.size = 'icon';

		effect(() => {
			const computedClass = this._computedClass();

			untracked(() => button.setClass(computedClass));
		});
	}
}
