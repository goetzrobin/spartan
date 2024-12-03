import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
	HlmPaginationContentDirective,
	HlmPaginationDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationNextComponent,
	HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';
import { map } from 'rxjs';

@Component({
	selector: 'spartan-pagination-query-params',
	standalone: true,
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
	],
	template: `
		<nav hlmPagination>
			<ul hlmPaginationContent>
				@if (currentPage() > 1) {
					<li hlmPaginationItem>
						<hlm-pagination-previous link="." [queryParams]="{ page: currentPage() - 1 }" queryParamsHandling="merge" />
					</li>
				}
				@for (page of pages; track 'page_' + page) {
					<li hlmPaginationItem>
						<a
							hlmPaginationLink
							[link]="currentPage() !== page ? '.' : undefined"
							[queryParams]="{ page }"
							queryParamsHandling="merge"
							[isActive]="currentPage() === page"
						>
							{{ page }}
						</a>
					</li>
				}

				@if (currentPage() < pages[pages.length - 1]) {
					<li hlmPaginationItem>
						<hlm-pagination-next link="." [queryParams]="{ page: currentPage() + 1 }" queryParamsHandling="merge" />
					</li>
				}
			</ul>
		</nav>
	`,
})
export class PaginationQueryParamsComponent {
	private readonly route = inject(ActivatedRoute);

	private readonly pageQuery = toSignal(
		this.route.queryParamMap.pipe(
			map((params) => {
				const pageQuery = params.get('page');
				return pageQuery ? +pageQuery : undefined;
			}),
		),
	);

	currentPage = computed(() => this.pageQuery() ?? 1);

	pages = [1, 2, 3, 4];
}

export const queryParamsCode = `
import { Component } from '@angular/core';
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
	selector: 'spartan-pagination-icon-only',
	standalone: true,
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
		HlmPaginationEllipsisComponent,
	],
	template: \`
		<nav hlmPagination>
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous iconOnly="true" link="/components/menubar" />
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">1</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#" isActive>2</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">3</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-next iconOnly="true" link="/components/popover" />
				</li>
			</ul>
		</nav>
	\`,
})
export class PaginationIconOnlyComponent {}
`;
