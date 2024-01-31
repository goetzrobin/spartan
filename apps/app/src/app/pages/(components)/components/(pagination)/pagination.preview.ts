import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationEllipsisComponent,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';

@Component({
	selector: 'spartan-pagination-preview',
	standalone: true,
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
		HlmPaginationEllipsisComponent,
		RouterLink,
	],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous href="#" />
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink>1</a>
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink isActive>2</a>
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink>3</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-next href="#" />
				</li>
			</ul>
		</nav>
	`,
})
export class PaginationPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationEllipsisComponent,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';

@Component({
	selector: 'spartan-pagination-preview',
	standalone: true,
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
		HlmPaginationEllipsisComponent,
		RouterLink,
	],
	template: \`
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous href="#" />
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink>1</a>
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink isActive>2</a>
				</li>
				<li hlmPaginationItem>
					<a routerLink="#" hlmPaginationLink>3</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-next href="#" />
				</li>
			</ul>
		</nav>
	\`,
})
export class PaginationPreviewComponent {}
`;

export const defaultImports = `
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationEllipsisComponent,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';
`;

export const defaultSkeleton = `
<nav hlmPagination>
  <ul hlmPaginationContent>
    <li hlmPaginationItem>
      <hlm-pagination-previous href="#" />
    </li>
    <li hlmPaginationItem>
      <a routerLink="#" hlmPaginationLink>1</a>
    </li>
    <li hlmPaginationItem>
      <a routerLink="#" hlmPaginationLink isActive>2</a>
    </li>
    <li hlmPaginationItem>
      <a routerLink="#" hlmPaginationLink>3</a>
    </li>
    <li hlmPaginationItem>
      <hlm-pagination-ellipsis />
    </li>
    <li hlmPaginationItem>
      <hlm-pagination-next href="#" />
    </li>
  </ul>
</nav>
`;
