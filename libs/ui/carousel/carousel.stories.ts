import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { HlmCardContentDirective, HlmCardDirective } from '../card/helm/src';
import { HlmCarouselComponent, HlmCarouselImports } from './helm/src';

const meta: Meta<HlmCarouselComponent> = {
	title: 'Carousel',
	component: HlmCarouselComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCarouselImports, HlmCardDirective, HlmCardContentDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCarouselComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <div class="flex justify-center items-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs">
        <hlm-carousel-content>
        ${Array.from(
					{ length: 5 },
					(_, i) => `
        <hlm-carousel-item>
          <div class="p-1">
            <section hlmCard>
              <p hlmCardContent class="flex aspect-square items-center justify-center p-6">
                <span class="text-4xl font-semibold">${i + 1}</span>
              </p>
            </section>
          </div>
        </hlm-carousel-item>
        `,
				).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};
