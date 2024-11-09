import { Component } from '@angular/core';
import { lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-breadcrumb-custom-separator',
	standalone: true,
	providers: [provideIcons({ lucideSlash })],
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconComponent,
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
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL href="/components">Components</a>
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
export class BreadcrumbCustomSeparatorComponent {}

export const breadcrumbCustomSeparatorCode = `
import { Component } from '@angular/core';
import { lucideSlash } from '@ng-icons/lucide';
import {
	HlmBreadcrumbComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbListDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-breadcrumb-custom-separator',
	standalone: true,
	providers: [provideIcons({ lucideSlash })],
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,

		HlmIconComponent,
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
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink hlmL href="/components">Components</a>
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
export class BreadcrumbCustomSeparatorComponent {}
`;

export const breadcrumbCustomSeparatorSkeleton = `
import { lucideSlash } from '@ng-icons/lucide';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

...

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
		<li hlmBreadcrumbItem>
			<a hlmBreadcrumbLink hlmL href="/components">Components</a>
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
`;