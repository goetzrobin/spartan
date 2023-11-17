import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAspectRatioDirective } from './helm/src';

export type AspectRatio = { ratio: string | number };
const meta: Meta<AspectRatio> = {
	title: 'Aspect Ratio',
	args: { ratio: '16/9' },
	argTypes: {
		ratio: {
			options: ['16/9', '1/1', '5/4', '3/2', 1.234],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmAspectRatioDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<AspectRatio>;

export const Default: Story = {
	args: {
		ratio: '16/9',
	},
	render: ({ ratio }) => ({
		props: {
			ratio,
		},
		template: `
      <div class='overflow-hidden rounded-xl drop-shadow max-w-xl'>
        <div [hlmAspectRatio]='ratio'>
          <img
            alt='Mountain views'
            src='/mountains.jpg'
          />
        </div>
      </div>
    `,
	}),
};
