import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BrnSwitchComponent, BrnSwitchThumbComponent } from './brain/src';
import { HlmSwitchDirective, HlmSwitchThumbDirective } from './helm/src';

const meta: Meta<BrnSwitchComponent> = {
  title: 'Switch',
  component: BrnSwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [BrnSwitchComponent, BrnSwitchThumbComponent, HlmSwitchThumbDirective, HlmSwitchDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrnSwitchComponent>;

export const Default: Story = {
  render: () => ({
    template: `
       <brn-switch id='testSwitch' aria-label='test switch' hlm>
        <brn-switch-thumb hlm />
      </brn-switch>
    `,
  }),
};
