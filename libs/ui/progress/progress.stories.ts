import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { BrnProgressComponent, BrnProgressIndicatorComponent } from './brain/src';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from './helm/src';

const meta: Meta<{ value: number }> = {
  title: 'Progress',
  decorators: [
    moduleMetadata({
      imports: [
        BrnProgressComponent,
        BrnProgressIndicatorComponent,
        HlmProgressDirective,
        HlmProgressIndicatorDirective,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<{ value: number }>;

export const Default: Story = {
  args: {
    value: 30,
  },
  render: ({ value }) => ({
    props: { value },
    template: `
    <h1 id='loading'>Loading (not started)</h1>
    <brn-progress aria-labelledby='loading' hlm value="0">
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h1 id='loading-started'>Loading (started)</h1>
    <brn-progress aria-labelledby='loading-started' hlm [value]="value">
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h1 id='indeterminate'>Indeterminate</h1>
    <brn-progress aria-labelledby='indeterminate' hlm [value]="null">
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h1 id='complete'>Complete</h1>
    <brn-progress aria-labelledby='complete' hlm value="100">
      <brn-progress-indicator hlm/>
    </brn-progress>
    `,
  }),
};
