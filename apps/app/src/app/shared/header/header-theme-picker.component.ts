import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../theme.service';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@ng-spartan/ui/popover/brain';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmPopoverContentDirective } from '@ng-spartan/ui/popover/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixMoon } from '@ng-icons/radix-icons';

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
  ],
  providers: [provideIcons({ radixMoon })],
  template: `
    <brn-popover scrollStrategy="close" align="end" sideOffset="5" closeDelay="100">
      <button size="sm" variant="ghost" brnPopoverTrigger hlmBtn>
        <hlm-icon name="radixMoon" size="sm" />
        <span class="sr-only">Open popover to change theme</span>
      </button>
      <div hlmPopoverContent *brnPopoverContent class="w-40 grid p-0.5 bg-popover text-popover-foreground">
        <button (click)="setTheme('light')" class="justify-start" hlmBtn variant="ghost" size="sm">Light</button>
        <button (click)="setTheme('dark')" class="justify-start" hlmBtn variant="ghost" size="sm">Dark</button>
        <button (click)="setTheme('system')" class="justify-start" hlmBtn variant="ghost" size="sm">System</button>
      </div>
    </brn-popover>
  `,
})
export class HeaderThemePickerComponent {
  private _themeService = inject(ThemeService);
  public setTheme(theme: Theme) {
    this._themeService.setTheme(theme);
  }
}
