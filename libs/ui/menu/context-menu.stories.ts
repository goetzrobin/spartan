import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { BrnContextMenuTriggerDirective, BrnMenuTriggerDirective } from './brain/src';
import { HlmMenuComponent, HlmMenuImports } from './helm/src';

const meta: Meta<HlmMenuComponent> = {
	title: 'Context Menu',
	component: HlmMenuComponent,
	tags: ['autodocs'],
	args: {
		variant: 'default',
	},
	argTypes: {
		variant: {
			options: ['default', 'menubar'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [
				BrnContextMenuTriggerDirective,
				BrnMenuTriggerDirective,
				HlmMenuImports,
				HlmButtonDirective,
				HlmIconComponent,
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmMenuComponent>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
        <div [brnCtxMenuTriggerFor]='menu'
         class='border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm'>
      Right click here
    </div>

    <ng-template #menu>
      <hlm-menu ${argsToTemplate(args)} class='w-64'>
        <hlm-menu-group>
          <button inset hlmMenuItem>
            Back
            <hlm-menu-shortcut>⌘[</hlm-menu-shortcut>
          </button>

          <button disabled inset hlmMenuItem>
            Forward
            <hlm-menu-shortcut>⌘]</hlm-menu-shortcut>
          </button>

          <button disabled inset hlmMenuItem>
            Reload
            <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
          </button>

          <button inset hlmMenuItem [brnMenuTriggerFor]='moreTools'>
            More Tools
            <hlm-menu-item-sub-indicator />
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItemCheckbox checked>
            <hlm-menu-item-check />
            Show Booksmarks Bar
            <hlm-menu-shortcut>⌘⇧B</hlm-menu-shortcut>
          </button>
          <button hlmMenuItemCheckbox>
            <hlm-menu-item-check />
            Show full URLs
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />
        <hlm-menu-label inset>People</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button hlmMenuItemRadio checked>
            <hlm-menu-item-radio />
            Pedro Duarte
          </button>
          <button hlmMenuItemRadio>
            <hlm-menu-item-radio />
            Colm Tuite
          </button>
        </hlm-menu-group>
      </hlm-menu>
    </ng-template>

    <ng-template #moreTools>
      <hlm-sub-menu class='w-48'>
        <button hlmMenuItem>
          Save Page as...
          <hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
        </button>
        <button hlmMenuItem>
          Create Shortcut...
        </button>
        <button hlmMenuItem>
          Name Window...
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>Developer Tools</button>
      </hlm-sub-menu>
    </ng-template>
    `,
	}),
};
