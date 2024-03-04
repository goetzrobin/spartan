import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePalette } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { AppThemes, Theme, ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-theme-picker',
	standalone: true,
	imports: [BrnMenuTriggerDirective, HlmMenuImports, HlmButtonDirective, HlmIconComponent, AsyncPipe, TitleCasePipe],
	providers: [provideIcons({ lucidePalette })],
	template: `
		<button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="themes" hlmBtn>
			<hlm-icon name="lucidePalette" size="sm" />
			<span class="sr-only">Open menu to change theme</span>
		</button>
		<ng-template #themes>
			<hlm-menu class="w-40">
				@for (theme of _supportedThemes; track theme) {
					<button hlmMenuItemCheckbox [checked]="_currentTheme() === theme" (click)="setTheme(theme)">
						<hlm-menu-item-check />
						{{ theme | titlecase }}
					</button>
				}
			</hlm-menu>
		</ng-template>
	`,
})
export class HeaderThemePickerComponent {
	private readonly _themeService = inject(ThemeService);
	protected readonly _currentTheme = this._themeService.theme;
	protected readonly _supportedThemes = AppThemes;
	public setTheme(theme: Theme) {
		this._themeService.setTheme(theme);
	}
}
