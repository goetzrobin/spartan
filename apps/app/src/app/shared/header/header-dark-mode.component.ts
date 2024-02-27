import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { DarkMode, ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-dark-mode',
	standalone: true,
	imports: [BrnMenuTriggerDirective, HlmMenuImports, HlmButtonDirective, HlmIconComponent, AsyncPipe, HlmMenuComponent],
	providers: [provideIcons({ lucideMoon })],
	template: `
		<button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="theme" hlmBtn>
			<hlm-icon name="lucideMoon" size="sm" />
			<span class="sr-only">Open menu to change theme</span>
		</button>
		<ng-template #theme>
			<hlm-menu class="w-40">
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'light'" (click)="setTheme('light')">
					<hlm-menu-item-check />
					Light
				</button>
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'dark'" (click)="setTheme('dark')">
					<hlm-menu-item-check />
					Dark
				</button>
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'system'" (click)="setTheme('system')">
					<hlm-menu-item-check />
					System
				</button>
			</hlm-menu>
		</ng-template>
	`,
})
export class HeaderDarkModeComponent {
	private _themeService = inject(ThemeService);
	theme$ = this._themeService.darkMode$;
	public setTheme(theme: DarkMode) {
		this._themeService.setDarkMode(theme);
	}
}
