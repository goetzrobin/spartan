import { NgModule } from '@angular/core';

import { HlmPaginationContentDirective } from './lib/hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from './lib/hlm-pagination-ellipsis.componet';
import { HlmPaginationItemDirective } from './lib/hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from './lib/hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from './lib/hlm-pagination-next.componet';
import { HlmPaginationPreviousComponent } from './lib/hlm-pagination-previous.componet';
import { HlmPaginationDirective } from './lib/hlm-pagination.directive';

export * from './lib/hlm-pagination-content.directive';
export * from './lib/hlm-pagination-ellipsis.componet';
export * from './lib/hlm-pagination-item.directive';
export * from './lib/hlm-pagination-link.directive';
export * from './lib/hlm-pagination-next.componet';
export * from './lib/hlm-pagination-previous.componet';
export * from './lib/hlm-pagination.directive';

export const HlmPaginationImports = [
	HlmPaginationDirective,
	HlmPaginationContentDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationPreviousComponent,
	HlmPaginationNextComponent,
	HlmPaginationEllipsisComponent,
] as const;

@NgModule({
	imports: [...HlmPaginationImports],
	exports: [...HlmPaginationImports],
})
export class HlmPaginationModule {}
