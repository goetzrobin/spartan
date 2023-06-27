import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmLabelDirective } from './helm/src';
import { HlmInputDirective } from '../input/helm/src';

const meta: Meta<{}> = {
  title: 'Label',
  decorators: [
    moduleMetadata({
      imports: [HlmInputDirective, HlmLabelDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <label hlmLabel>E-Mail
        <input class='w-80' hlmInput type='email' placeholder='Email'/>
    </label>
    `,
  }),
};
