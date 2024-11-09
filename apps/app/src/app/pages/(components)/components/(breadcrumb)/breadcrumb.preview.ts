import { Component } from '@angular/core';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-preview',
	standalone: true,
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbEllipsisComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

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
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-ellipsis class="h-4 w-4" [brnMenuTriggerFor]="breadcrumbDropdown" />
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
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL href="/components">Components</a>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</hlm-breadcrumb>
	`,
})
export class BreadcrumbPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuComponent, HlmMenuItemDirective } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-breadcrumb-preview',
	standalone: true,
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbEllipsisComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

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
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-ellipsis class="h-4 w-4" [brnMenuTriggerFor]="breadcrumbDropdown" />
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
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL href="/components">Components</a>
				</li>
				<li hlmBreadcrumbItem>
					<hlm-breadcrumb-separator />
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>Breadcrumb</span>
				</li>
			</ol>
		</hlm-breadcrumb>
	\`,
})
export class BreadcrumbPreviewComponent {}
`;

export const defaultImports = `
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
	HlmBreadcrumbLinkDirective,
} from '@spartan-ng/ui-breadcrumb-helm';
`;

export const defaultSkeleton = `
<hlm-breadcrumb>
	<ol hlmBreadcrumbList>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink href="/home">Home</a>
		</li>
		<li hlmBreadcrumbItem>
			<hlm-breadcrumb-separator />
		</li>
		<li hlmBreadcrumbItem>
			<hlm-breadcrumb-ellipsis />
		</li>
		<li hlmBreadcrumbItem>
			<hlm-breadcrumb-separator />
		</li>
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink hlmL href="/components">Components</a>
		</li>
		<li hlmBreadcrumbItem>
			<hlm-breadcrumb-separator />
		</li>
		<li hlmBreadcrumbItem>
			<span hlmBreadcrumbPage>Breadcrumb</span>
		</li>
	</ol>
</hlm-breadcrumb>
`;
