import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { BrnContextMenuImports } from './brain/src';
import { HlmMenuImports } from './helm/src';
import { provideIcons } from '@ng-icons/core';
import * as radixIcons from '@ng-icons/radix-icons';
import { HlmIconComponent } from '../icon/helm/src';

const meta: Meta<{}> = {
  title: 'Context Menu',
  decorators: [
    moduleMetadata({
      providers: [provideIcons(radixIcons)],
      imports: [BrnContextMenuImports, HlmMenuImports, HlmButtonDirective, HlmIconComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
        <div [brnCtxMenuTriggerFor]='menu'
         class='border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm'>
      Right click here
    </div>

    <ng-template #menu>
      <div hlm brnMenu class='w-64'>
        <div brnMenuGroup>
          <button inset hlm brnMenuItem>
            Back
            <hlm-menu-shortcut>⌘[</hlm-menu-shortcut>
          </button>

          <button disabled inset hlm brnMenuItem>
            Forward
            <hlm-menu-shortcut>⌘]</hlm-menu-shortcut>
          </button>

          <button disabled inset hlm brnMenuItem>
            Reload
            <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
          </button>

          <button inset hlm brnMenuItem [brnMenuTriggerFor]='moreTools'>
            More Tools
            <hlm-menu-item-sub-indicator />
          </button>

        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItemCheckbox checked>
            <hlm-menu-item-check />
            Show Booksmarks Bar
            <hlm-menu-shortcut>⌘⇧B</hlm-menu-shortcut>
          </button>
          <button hlm brnMenuItemCheckbox>
            <hlm-menu-item-check />
            Show full URLs
          </button>
        </div>

        <hlm-menu-separator />
        <hlm-menu-label inset>People</hlm-menu-label>
        <hlm-menu-separator />
        <div brnMenuGroup>
          <button hlm brnMenuItemRadio checked>
            <hlm-menu-item-radio />
            Pedro Duarte
          </button>
          <button hlm brnMenuItemRadio>
            <hlm-menu-item-radio />
            Colm Tuite
          </button>
        </div>
      </div>
    </ng-template>

    <ng-template #moreTools>
      <div hlm brnSubMenu class='w-48'>
        <button hlm brnMenuItem>
          Save Page as...
          <hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
        </button>
        <button hlm brnMenuItem>
          Create Shortcut...
        </button>
        <button hlm brnMenuItem>
          Name Window...
        </button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>Developer Tools</button>
      </div>
    </ng-template>
    `,
  }),
};
