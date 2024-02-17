import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmCalendarComponent } from './helm/src/lib/calendar';
import { DateAdapter } from './helm/src/lib/date-adapter';
import { HLM_DATE_FORMATS } from './helm/src/lib/date-formats';
import { HlmDatepickerComponent } from './helm/src/lib/datepicker';
import { HlmDatepickerInputDirective } from './helm/src/lib/datepicker-input';
import { HlmDatepickerToggleComponent } from './helm/src/lib/datepicker-toggle';
import { NativeDateAdapter } from './helm/src/lib/native-date-adapter';
import { HLM_NATIVE_DATE_FORMATS } from './helm/src/lib/native-date-formats';

const meta: Meta<HlmDatepickerInputDirective<Date>> = {
	title: 'Datepicker',
	component: HlmDatepickerInputDirective,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [
				BrowserAnimationsModule,
				HlmInputDirective,
				HlmLabelDirective,
				HlmDatepickerInputDirective,
				HlmDatepickerComponent,
				HlmDatepickerToggleComponent,
				HlmCalendarComponent,
			],
			providers: [
				{
					provide: DateAdapter,
					useClass: NativeDateAdapter,
				},
				{
					provide: HLM_DATE_FORMATS,
					useValue: HLM_NATIVE_DATE_FORMATS,
				},
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDatepickerInputDirective<Date>>;

export const Input: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="relative w-40">
			<label for="datepicker" hlmLabel> Select your birthdate </label>
			<input class="w-full" id="datepicker" hlmInput [hlmDatepicker]="picker" ${argsToTemplate(args)} />
			<hlm-datepicker-toggle class="absolute right-2 top-[50%]" [for]="picker" />
		</div>
		<hlm-datepicker #picker />
		`,
	}),
};

export const InlineCalendar: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="p-2">
			<hlm-calendar class="block w-80" />
		</div>
		`,
	}),
};
