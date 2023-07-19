import { Component } from '@angular/core';
import {
  BrnContextMenuTriggerDirective,
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemCheckboxDirective,
  BrnMenuItemDirective,
  BrnMenuItemRadioDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'spartan-context-menu-preview',
  standalone: true,
  imports: [
    BrnMenuDirective,
    BrnMenuItemDirective,
    BrnMenuTriggerDirective,
    BrnContextMenuTriggerDirective,
    BrnMenuGroupDirective,
    BrnMenuItemCheckboxDirective,
    BrnMenuItemRadioDirective,

    HlmMenuDirective,
    HlmSubMenuDirective,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuItemCheckComponent,
    HlmMenuItemRadioComponent,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  template: `
    <div
      [brnCtxMenuTriggerFor]="menu"
      class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </div>

    <ng-template #menu>
      <div hlm brnMenu class="w-64">
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

          <button inset hlm brnMenuItem [brnMenuTriggerFor]="moreTools">
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
      <div hlm brnSubMenu class="w-48">
        <button hlm brnMenuItem>
          Save Page as...
          <hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
        </button>
        <button hlm brnMenuItem>Create Shortcut...</button>
        <button hlm brnMenuItem>Name Window...</button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>Developer Tools</button>
      </div>
    </ng-template>
  `,
})
export class ContextMenuPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  BrnContextMenuTriggerDirective,
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemCheckboxDirective,
  BrnMenuItemDirective,
  BrnMenuItemRadioDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'spartan-context-menu-preview',
  standalone: true,
  imports: [
    BrnMenuDirective,
    BrnMenuItemDirective,
    BrnMenuTriggerDirective,
    BrnContextMenuTriggerDirective,
    BrnMenuGroupDirective,
    BrnMenuItemCheckboxDirective,
    BrnMenuItemRadioDirective,

    HlmMenuDirective,
    HlmSubMenuDirective,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuItemCheckComponent,
    HlmMenuItemRadioComponent,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  template: \`
    <div
      [brnCtxMenuTriggerFor]="menu"
      class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </div>

    <ng-template #menu>
      <div hlm brnMenu class="w-64">
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

          <button inset hlm brnMenuItem [brnMenuTriggerFor]="moreTools">
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
      <div hlm brnSubMenu class="w-48">
        <button hlm brnMenuItem>
          Save Page as...
          <hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
        </button>
        <button hlm brnMenuItem>Create Shortcut...</button>
        <button hlm brnMenuItem>Name Window...</button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>Developer Tools</button>
      </div>
    </ng-template>
  \`,
})
export class ContextMenuPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnContextMenuTriggerDirective,
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemCheckboxDirective,
  BrnMenuItemDirective,
  BrnMenuItemRadioDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';
`;

export const defaultSkeleton = `
<div
[brnCtxMenuTriggerFor]="menu"
class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
>
Right click here
</div>

<ng-template #menu>
<div hlm brnMenu class="w-64">
  <div brnMenuGroup>
    <button inset hlm brnMenuItem>
      Save
      <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
    </button>

    <button inset hlm brnMenuItem [brnMenuTriggerFor]="moreTools">
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
<div hlm brnSubMenu class="w-48">
  <button hlm brnMenuItem>
    Save Page as...
    <hlm-menu-shortcut>⇧⌘S</hlm-menu-shortcut>
  </button>
</div>
</ng-template>
`;
