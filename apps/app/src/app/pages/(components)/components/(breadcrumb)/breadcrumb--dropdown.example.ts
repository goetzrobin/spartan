import { Component } from '@angular/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	standalone: true,
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconComponent,
		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuItemDirective,
	],
	template: `
		<hlm-breadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink href="/home">Home</a>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</hlm-breadcrumb-separator>
				</li>
				<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
					<div class="flex items-center gap-1">
						Components
						<hlm-icon name="lucideChevronDown" class="h-4 w-4" />
					</div>
					<ng-template #breadcrumbDropdown>
						<hlm-menu>
							<button hlmMenuItem id="document">
								<span>Documentation</span>
							</button>
							<button hlmMenuItem id="themes">
								<span>Themes</span>
							</button>
							<button hlmMenuItem id="github">
								<span>Github</span>
							</button>
						</hlm-menu>
					</ng-template>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</hlm-breadcrumb-separator>
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</hlm-breadcrumb>
	`,
})
export class BreadcrumbDropdownComponent {}

export const breadcrumbDropdownCode = `
import { Component } from '@angular/core';
import { lucideChevronDown, lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-dropdown',
	standalone: true,
	providers: [provideIcons({ lucideChevronDown, lucideSlash })],
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconComponent,
		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuItemDirective,
	],
	template: \`
		<hlm-breadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink href="/home">Home</a>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</hlm-breadcrumb-separator>
				</li>
				<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
					<div class="flex items-center gap-1">
						Components
						<hlm-icon name="lucideChevronDown" class="h-4 w-4" />
					</div>
					<ng-template #breadcrumbDropdown>
						<hlm-menu>
							<button hlmMenuItem id="document">
								<span>Documentation</span>
							</button>
							<button hlmMenuItem id="themes">
								<span>Themes</span>
							</button>
							<button hlmMenuItem id="github">
								<span>Github</span>
							</button>
						</hlm-menu>
					</ng-template>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</hlm-breadcrumb-separator>
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</hlm-breadcrumb>
	\`,
})
export class BreadcrumbDropdownComponent {}
`

export const breadcrumbDropdownSkeleton = `
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

...

<hlm-breadcrumb>
	<ol hlmBreadcrumbList>
		<li hlmBreadcrumbItem [brnMenuTriggerFor]="breadcrumbDropdown">
			<div class="flex items-center gap-1">
				Components
				<hlm-icon name="lucideChevronDown" class="h-4 w-4" />
			</div>
			<ng-template #breadcrumbDropdown>
				<hlm-menu>
					<button hlmMenuItem id="document">
						<span>Documentation</span>
					</button>
					<button hlmMenuItem id="themes">
						<span>Themes</span>
					</button>
					<button hlmMenuItem id="github">
						<span>Github</span>
					</button>
				</hlm-menu>
			</ng-template>
		</li>
	</ol>
</hlm-breadcrumb>
`;