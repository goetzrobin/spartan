import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnDestroy, PLATFORM_ID, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectHlmIconConfig } from './hlm-icon.token';

const DEFINED_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', 'none'] as const;

type DefinedSizes = (typeof DEFINED_SIZES)[number];

export const iconVariants = cva('inline-flex', {
	variants: {
		variant: {
			xs: 'h-3 w-3',
			sm: 'h-4 w-4',
			base: 'h-6 w-6',
			lg: 'h-8 w-8',
			xl: 'h-12 w-12',
			none: '',
		} satisfies Record<DefinedSizes, string>,
	},
	defaultVariants: {
		variant: 'base',
	},
});

export type IconVariants = VariantProps<typeof iconVariants>;

export type IconSize = DefinedSizes | (Record<never, never> & string);

const isDefinedSize = (size: IconSize): size is DefinedSizes => {
	return DEFINED_SIZES.includes(size as DefinedSizes);
};

@Directive({
	selector: 'ng-icon[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[style.--ng-icon__size]': 'size()',
	},
})
export class HlmIconDirective implements OnDestroy {
	private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _config = injectHlmIconConfig();
	private readonly _platform = inject(PLATFORM_ID);

	public readonly size = input<IconSize>(this._config.size);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => {
		const size: IconSize = this.size();
		const variant = isDefinedSize(size) ? size : 'none';
		return hlm(iconVariants({ variant }), this.userClass());
	});

	private readonly _observer?: MutationObserver;

	constructor() {
		if (isPlatformBrowser(this._platform)) {
			// listen for changes to the style attribute, if the size is a predefined size, remove the ng-icon size variable
			this._observer = new MutationObserver(() => {
				const size = this._element.nativeElement.style.getPropertyValue('--ng-icon__size');

				if (isDefinedSize(size as IconSize)) {
					this._element.nativeElement.style.setProperty('--ng-icon__size', '');
				}
			});

			this._observer.observe(this._element.nativeElement, { attributes: true, attributeFilter: ['style'] });
		}
	}

	ngOnDestroy() {
		this._observer?.disconnect();
	}
}
