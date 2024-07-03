import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideLayoutGrid,
	lucideLibrary,
	lucideListMusic,
	lucideMic2,
	lucideMusic2,
	lucidePlayCircle,
	lucideRadio,
	lucideUser,
} from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { SideMenuButtonComponent } from './side-menu-button.component';

interface ListItem {
	text: string;
	icon: string;
	selected?: boolean;
}

@Component({
	selector: 'music-side-menu',
	standalone: true,
	host: {
		class: 'block',
	},
	imports: [SideMenuButtonComponent, HlmIconComponent, HlmScrollAreaComponent, NgClass],
	providers: [
		provideIcons({
			lucidePlayCircle,
			lucideLayoutGrid,
			lucideRadio,
			lucideListMusic,
			lucideMusic2,
			lucideUser,
			lucideMic2,
			lucideLibrary,
		}),
	],
	template: `
		<div class="side-menu border-border hidden h-full border-r lg:block">
			<div class="space-y-4 py-4">
				<div class="px-3 py-2">
					<h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Discover</h2>
					<div class="space-y-1">
						@for (item of discover; track item) {
							<music-side-button class="font-medium" [ngClass]="{ 'bg-secondary': !!item.selected }">
								<hlm-icon size="sm" [name]="item.icon" class="mr-2 h-4 w-4" />
								{{ item.text }}
							</music-side-button>
						}
					</div>
				</div>

				<div class="px-3 py-2">
					<h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Library</h2>
					<div class="space-y-1">
						@for (item of library; track item) {
							<music-side-button class="font-medium">
								<hlm-icon size="sm" [name]="item.icon" class="mr-2 h-4 w-4" />
								{{ item.text }}
							</music-side-button>
						}
					</div>
				</div>

				<div class="py-2">
					<h2 class="mb-2 px-7 text-lg font-semibold tracking-tight">Playlists</h2>
					<div class="space-y-1   ">
						<hlm-scroll-area class="h-[300px]" visibility="hover">
							@for (item of playlists; track item) {
								<music-side-button class="px-4">
									<hlm-icon size="sm" [name]="item.icon" class="mr-2 h-4 w-4" />
									{{ item.text }}
								</music-side-button>
							}
						</hlm-scroll-area>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class SideMusicMenuComponent {
	playlists: ListItem[] = [
		{ text: 'Recently Added', icon: 'lucideListMusic' },
		{ text: 'Recently Played', icon: 'lucideListMusic' },
		{ text: 'Top Songs', icon: 'lucideListMusic' },
		{ text: 'Top Albums', icon: 'lucideListMusic' },
		{ text: 'Top Artists', icon: 'lucideListMusic' },
		{ text: 'Logic Discography', icon: 'lucideListMusic' },
		{ text: 'Bedtime Beats', icon: 'lucideListMusic' },
		{ text: 'Feeling Happy', icon: 'lucideListMusic' },
		{ text: 'I Miss Y2K Pop', icon: 'lucideListMusic' },
		{ text: 'Runtober', icon: 'lucideListMusic' },
		{ text: 'Mellow Days', icon: 'lucideListMusic' },
		{ text: 'Eminem Essentials', icon: 'lucideListMusic' },
	];

	library: ListItem[] = [
		{ text: 'Playlists', icon: 'lucideListMusic' },
		{ text: 'Songs', icon: 'lucideMusic2' },
		{ text: 'Made for You', icon: 'lucideUser' },
		{ text: 'Artists', icon: 'lucideMic2' },
		{ text: 'Albums', icon: 'lucideLibrary' },
	];

	discover: ListItem[] = [
		{ text: 'Listen Now', icon: 'lucidePlayCircle', selected: true },
		{ text: 'Browse', icon: 'lucideLayoutGrid' },
		{ text: 'Radio', icon: 'lucideRadio' },
	];
}
