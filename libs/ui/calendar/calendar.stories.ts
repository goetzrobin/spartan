import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmCalendarComponent } from './helm/src/lib/hlm-calendar.component';

const meta: Meta<HlmCalendarComponent<Date>> = {
	title: 'Calendar',
	component: HlmCalendarComponent,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmCalendarComponent],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-calendar [min]="min" />
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmCalendarComponent<Date>>;

export const Default: Story = {
	args: {
		date: new Date(),
		min: new Date(new Date().setDate(new Date().getDate() - 1)),
	},
};
