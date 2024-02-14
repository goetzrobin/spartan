import { Component, EventEmitter, Output } from '@angular/core';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { SideNavComponent } from './side-nav-coming-soon.component';
import { SideNavHeadingDirective } from './side-nav-heading.directive';
import { SideNavLinkDirective } from './side-nav-link.directive';
import { SideNavLinksComponent } from './side-nav-links.directive';

@Component({
	selector: 'spartan-side-nav-content',
	standalone: true,
	imports: [
		HlmScrollAreaComponent,
		SideNavLinkDirective,
		SideNavLinksComponent,
		SideNavHeadingDirective,
		SideNavComponent,
	],
	host: {
		class: 'block px-1',
	},
	template: `
		<div class="pb-4">
			<h4 spartanSideNavHeading>Getting Started</h4>
			<spartan-side-nav-links>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/introduction">Introduction</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/cli">CLI</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/changelog">Changelog</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/about">About & Credits</a>
			</spartan-side-nav-links>
		</div>

		<div class="pb-4">
			<h4 spartanSideNavHeading>Stack</h4>
			<spartan-side-nav-links>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/stack/overview">Overview</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/stack/technologies">Technologies</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/stack/installation">Installation</a>
			</spartan-side-nav-links>
		</div>

		<div class="pb-4">
			<h4 spartanSideNavHeading>UI</h4>
			<spartan-side-nav-links>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/installation">Installation</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/theming">Theming</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/dark-mode">Dark mode</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/typography">Typography</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/documentation/figma">Figma</a>
			</spartan-side-nav-links>
		</div>

		<div class="pb-4">
			<h4 spartanSideNavHeading>Components</h4>
			<spartan-side-nav-links>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/accordion">Accordion</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/alert">Alert</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/alert-dialog">Alert Dialog</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/aspect-ratio">Aspect Ratio</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/avatar">Avatar</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/badge">Badge</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/button">Button</a>
				<a disabled spartanSideNavLink="/components/calendar">
					Calendar
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/card">Card</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/checkbox">Checkbox</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/collapsible">Collapsible</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/combobox">Combobox</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/command">Command</a>
				<a spartanSideNavLink="/components/context-menu">Context Menu</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/data-table">Data Table</a>
				<a disabled spartanSideNavLink="/components/picker">
					Date Picker
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/dialog">Dialog</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/dropdown-menu">Dropdown Menu</a>
				<a disabled spartanSideNavLink="/components/form">
					Form
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/hover-card">Hover Card</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/input">Input</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/label">Label</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/menubar">Menubar</a>
				<a disabled spartanSideNavLink="/components/navigation-menu">
					Navigation Menu
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/pagination">Pagination</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/popover">Popover</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/progress">Progress</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/radio-group">Radio Group</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/scroll-area">Scroll Area</a>
				<a disabled spartanSideNavLink="/components/select">
					Select
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/separator">Separator</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/sheet">Sheet</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/skeleton">Skeleton</a>
				<a disabled spartanSideNavLink="/components/slider">
					Slider
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/spinner">Spinner</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/switch">Switch</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/table">Table</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/tabs">Tabs</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/textarea">Textarea</a>
				<a disabled spartanSideNavLink="/components/toast">
					Toast
					<spartan-side-nav-cs />
				</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/toggle">Toggle</a>
				<a (click)="linkClicked.emit()" spartanSideNavLink="/components/tooltip">Tooltip</a>
			</spartan-side-nav-links>
		</div>
	`,
})
export class SideNavContentComponent {
	@Output()
	linkClicked = new EventEmitter<void>();
}
