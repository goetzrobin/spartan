import { AsyncPipe, NgForOf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixColorWheel } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuDirective, BrnMenuItemCheckboxDirective, BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuDirective, HlmMenuItemCheckComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';
import {
	BrnPopoverComponent,
	BrnPopoverContentDirective,
	BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { AppThemes, Theme, ThemeService } from '../theme.service';

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
		NgForOf,
		TitleCasePipe,
	],
	providers: [provideIcons({ radixColorWheel })],
	template: `
		<button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="themes" hlmBtn>
			<hlm-icon name="radixColorWheel" size="sm" />
			<span class="sr-only">Open menu to change theme</span>
		</button>
		<ng-template #themes>
			<div hlm brnMenu class="w-40">
				<button
					hlm
					brnMenuItemCheckbox
					*ngFor="let theme of _supportedThemes"
					[checked]="_currentTheme() === theme"
					(click)="setTheme(theme)"
				>
					<hlm-menu-item-check />
					{{ theme | titlecase }}
				</button>
			</div>
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
