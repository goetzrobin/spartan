import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSkeletonComponent } from './helm/src';

const meta: Meta<HlmSkeletonComponent> = {
	title: 'Skeleton',
	component: HlmSkeletonComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmSkeletonComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmSkeletonComponent>;

export const Default: Story = {
	render: () => ({
		template: `
   <div class='border p-4 m-4 w-fit rounded-lg border-border flex items-center space-x-4'>
      <hlm-skeleton class='h-12 w-12 rounded-full' />
      <div class='space-y-2'>
        <hlm-skeleton class='h-4 w-[250px]' />
        <hlm-skeleton class='h-4 w-[200px]' />
      </div>
    </div>
    `,
	}),
};
