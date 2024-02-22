import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	InputSignal,
	Signal,
	ViewChild,
	ViewEncapsulation,
	computed,
	input,
	signal,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { EmblaCarouselDirective, EmblaEventType, EmblaPluginType, type EmblaOptionsType } from 'embla-carousel-angular';

@Component({
	selector: 'hlm-carousel',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
		role: 'region',
		'aria-roledescription': 'carousel',
	},
	imports: [EmblaCarouselDirective],
	template: `
		<div
			emblaCarousel
			class="overflow-hidden"
			[plugins]="plugins()"
			[options]="emblaOptions()"
			[subscribeToEvents]="['init', 'select', 'reInit']"
			(emblaChange)="onEmblaEvent($event)"
		>
			<ng-content select="hlm-carousel-content" />
		</div>
		<ng-content />
	`,
})
export class HlmCarouselComponent {
	@ViewChild(EmblaCarouselDirective) protected emblaCarousel?: EmblaCarouselDirective;

	_userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('relative', this._userClass()));

	orientation = input<'horizontal' | 'vertical'>('horizontal');
	options: InputSignal<Omit<EmblaOptionsType, 'axis'> | undefined> = input();
	plugins: InputSignal<EmblaPluginType[]> = input([] as EmblaPluginType[]);

	protected emblaOptions: Signal<EmblaOptionsType> = computed(() => ({
		...this.options(),
		axis: this.orientation() === 'horizontal' ? 'x' : 'y',
	}));

	private _canScrollPrev = signal(false);
	canScrollPrev = this._canScrollPrev.asReadonly();
	private _canScrollNext = signal(false);
	canScrollNext = this._canScrollNext.asReadonly();

	protected onEmblaEvent(event: EmblaEventType) {
		const emblaApi = this.emblaCarousel?.emblaApi;

		if (!emblaApi) {
			return;
		}

		if (event === 'select' || event === 'init' || event === 'reInit') {
			this._canScrollPrev.set(emblaApi.canScrollPrev());
			this._canScrollNext.set(emblaApi.canScrollNext());
		}
	}

	@HostListener('keydown', ['$event'])
	protected onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			this.emblaCarousel?.scrollPrev();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			this.emblaCarousel?.scrollNext();
		}
	}

	scrollPrev() {
		this.emblaCarousel?.scrollPrev();
	}

	scrollNext() {
		this.emblaCarousel?.scrollNext();
	}
}
