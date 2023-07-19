import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../theme.service';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixMoon } from '@ng-icons/radix-icons';
import { BrnMenuDirective, BrnMenuItemCheckboxDirective, BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuDirective, HlmMenuItemCheckComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'spartan-theme-picker',
  standalone: true,
  imports: [
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmButtonDirective,
    HlmIconComponent,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    BrnMenuTriggerDirective,
    BrnMenuDirective,
    HlmMenuDirective,
    BrnMenuItemCheckboxDirective,
    AsyncPipe,
    HlmMenuItemDirective,
    HlmMenuItemCheckComponent,
  ],
  providers: [provideIcons({ radixMoon })],
  template: `
    <button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="theme" hlmBtn>
      <hlm-icon name="radixMoon" size="sm" />
      <span class="sr-only">Open menu to change theme</span>
    </button>
    <ng-template #theme>
      <div hlm brnMenu class="w-40">
        <button hlm brnMenuItemCheckbox [checked]="(theme$ | async) === 'light'" (click)="setTheme('light')">
          <hlm-menu-item-check />
          Light
        </button>
        <button hlm brnMenuItemCheckbox [checked]="(theme$ | async) === 'dark'" (click)="setTheme('dark')">
          <hlm-menu-item-check />
          Dark
        </button>
        <button hlm brnMenuItemCheckbox [checked]="(theme$ | async) === 'system'" (click)="setTheme('system')">
          <hlm-menu-item-check /> System
        </button>
      </div>
    </ng-template>
  `,
})
export class HeaderThemePickerComponent {
  private _themeService = inject(ThemeService);
  theme$ = this._themeService.theme$;
  public setTheme(theme: Theme) {
    this._themeService.setTheme(theme);
  }
}
