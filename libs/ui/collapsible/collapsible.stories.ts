import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnCollapsibleComponent } from './brain/src';
import { BrnCollapsibleTriggerDirective } from './brain/src/lib/brn-collapsible-trigger.directive';
import { BrnCollapsibleContentComponent } from './brain/src/lib/brn-collapsible-content.component';
import { HlmButtonDirective } from '../button/helm/src';

const meta: Meta<{}> = {
  title: 'Collapsible',
  decorators: [
    moduleMetadata({
      imports: [
        HlmButtonDirective,
        BrnCollapsibleComponent,
        BrnCollapsibleTriggerDirective,
        BrnCollapsibleContentComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <brn-collapsible
          class="flex flex-col w-[350px] space-y-2"
    >
      <div class="flex items-center justify-between space-x-4 px-4">
        <h4 class="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <button brnCollapsibleTrigger hlmBtn variant="ghost" size="sm" class="w-9 p-0">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
             <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
             </svg>
            <span class="sr-only">Toggle</span>
          </button>
      </div>
      <div class="rounded-md border-border border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <brn-collapsible-content class="space-y-2">
        <div class="rounded-md border-border border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div class="rounded-md border-border border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </brn-collapsible-content>
    </brn-collapsible>
    `,
  }),
};
