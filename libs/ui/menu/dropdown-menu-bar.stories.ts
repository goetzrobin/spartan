import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { BrnMenuBarImports, BrnMenuImports } from './brain/src';
import { HlmMenuBarImports, HlmMenuImports } from './helm/src';
import { provideIcons } from '@ng-icons/core';
import * as radixIcons from '@ng-icons/radix-icons';
import { HlmIconComponent } from '../icon/helm/src';

const meta: Meta<{}> = {
  title: ' Menubar',
  decorators: [
    moduleMetadata({
      providers: [provideIcons(radixIcons)],
      imports: [
        BrnMenuImports,
        BrnMenuBarImports,
        HlmMenuImports,
        HlmMenuBarImports,

        HlmButtonDirective,
        HlmIconComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
        <div hlm brnMenuBar class='w-fit'>
      <button hlmMenuBarItem brnMenuItem [brnMenuTriggerFor]='file'>File</button>
      <button hlmMenuBarItem brnMenuItem [brnMenuTriggerFor]='edit'>Edit</button>
      <button hlmMenuBarItem brnMenuItem [brnMenuTriggerFor]='view'>View</button>
      <button hlmMenuBarItem brnMenuItem [brnMenuTriggerFor]='profiles'>Profiles</button>
    </div>

    <ng-template #file>
      <div hlm brnMenu variant='menubar' class='w-48'>
        <div brnMenuGroup>
          <button hlm brnMenuItem>
            New Tab
            <hlm-menu-shortcut>⌘T</hlm-menu-shortcut>
          </button>
          <button hlm brnMenuItem>
            New Window
            <hlm-menu-shortcut>⌘N</hlm-menu-shortcut>
          </button>
          <button hlm brnMenuItem disabled>New Incognito Window</button>

        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem [brnMenuTriggerFor]='share'>
          Share
          <hlm-menu-item-sub-indicator />
        </button>

        <hlm-menu-separator />

        <button hlm brnMenuItem>
          Print...
          <hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
        </button>

      </div>
    </ng-template>
    <ng-template #share>
      <div hlm brnSubMenu>
        <button hlm brnMenuItem>
          Email link
        </button>
        <button hlm brnMenuItem>
          Messages
        </button>
        <button hlm brnMenuItem>
          Notes
        </button>
      </div>
    </ng-template>

    <ng-template #edit>
      <div hlm brnMenu variant='menubar' class='w-48'>
        <div brnMenuGroup>
          <button hlm brnMenuItem>
            Undo
            <hlm-menu-shortcut>⌘Z</hlm-menu-shortcut>
          </button>
          <button hlm brnMenuItem>
            Redo
            <hlm-menu-shortcut>⇧⌘Z</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem [brnMenuTriggerFor]='find'>
          Share
          <hlm-menu-item-sub-indicator />
        </button>

        <hlm-menu-separator />

        <button hlm brnMenuItem>Cut</button>
        <button hlm brnMenuItem>Copy</button>
        <button hlm brnMenuItem>Paste</button>

      </div>
    </ng-template>
    <ng-template #find>
      <div hlm brnSubMenu>
        <button hlm brnMenuItem>
          Search the web
        </button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>
          Find...
        </button>
        <button hlm brnMenuItem>
          Find Next
        </button>
        <button hlm brnMenuItem>
          Find Previous
        </button>
      </div>
    </ng-template>

    <ng-template #view>
      <div hlm brnMenu variant='menubar'>
        <button hlm brnMenuItemCheckbox>
          <hlm-menu-item-check />
          Always Show Bookmarks Bar
        </button>
        <button hlm brnMenuItemCheckbox checked>
          <hlm-menu-item-check />
          Always Show Full URLs
        </button>
        <hlm-menu-separator />
        <button inset hlm brnMenuItem>
          Reload
          <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
        </button>
        <button inset disabled hlm brnMenuItem>
          Force Reload
          <hlm-menu-shortcut>⇧⌘R</hlm-menu-shortcut>
        </button>
        <hlm-menu-separator />
        <button inset hlm brnMenuItem>
          Toggle Fullscreen
        </button>
        <hlm-menu-separator />
        <button inset hlm brnMenuItem>
          Hide Sidebar
        </button>
      </div>
    </ng-template>

    <ng-template #profiles>
      <div hlm brnMenu variant='menubar' class='w-48'>
        <button hlm brnMenuItemRadio>
          <hlm-menu-item-radio />
          Andy
        </button>
        <button hlm brnMenuItemRadio checked>
          <hlm-menu-item-radio />
          Benoit
        </button>
        <button hlm brnMenuItemRadio>
          <hlm-menu-item-radio />
          Lewis
        </button>
        <hlm-menu-separator />
        <button inset hlm brnMenuItem>
          Edit...
        </button>
        <hlm-menu-separator />
        <button inset hlm brnMenuItem>
          Add Profile...
        </button>
      </div>
    </ng-template>
    `,
  }),
};
