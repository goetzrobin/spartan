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

@Component({
	selector: 'spartan-breadcrumb-collapsed',
	standalone: true,
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbEllipsisComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,
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
	`,
})
export class BreadcrumbCollapsedComponent {}

export const breadcrumbCollapsedCode = `
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

@Component({
	selector: 'spartan-breadcrumb-collapsed',
	standalone: true,
	imports: [
		HlmBreadcrumbComponent,
		HlmBreadcrumbSeparatorComponent,
		HlmBreadcrumbEllipsisComponent,
		HlmBreadcrumbListDirective,
		HlmBreadcrumbItemDirective,
		HlmBreadcrumbPageDirective,
		HlmBreadcrumbLinkDirective,
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
	\`,
})
export class BreadcrumbCollapsedComponent {}
`;

export const breadcrumbCollapsedSkeleton = `
import { lmBreadcrumbEllipsisComponent } from '@spartan-ng/ui-breadcrumb-helm';

...

<hlm-breadcrumb>
    <ol hlmBreadcrumbList>
        {/*  ...  */}
        <li hlmBreadcrumbItem>
            <hlm-breadcrumb-ellipsis />
        </li>
        {/*  ...  */}
    </ol>
</hlm-breadcrumb>
`;