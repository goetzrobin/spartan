import { NgModule } from '@angular/core';
import { HlmBreadcrumbComponent } from './lib/breadcrumb.component';
import { HlmBreadcrumbEllipsisComponent } from './lib/breadcrumb-ellipsis.component';
import { HlmBreadcrumbSeparatorComponent } from './lib/breadcrumb-separator.component';
import { HlmBreadcrumbItemDirective } from './lib/breadcrumb-item.directive';
import { HlmBreadcrumbLinkDirective } from './lib/breadcrumb-link.directive';
import { HlmBreadcrumbPageDirective } from './lib/breadcrumb-page.directive';
import { HlmBreadcrumbListDirective } from './lib/breadcrumb-list.directive';

export * from './lib/breadcrumb.component';
export * from './lib/breadcrumb-ellipsis.component';
export * from './lib/breadcrumb-separator.component';
export * from './lib/breadcrumb-item.directive';
export * from './lib/breadcrumb-list.directive';
export * from './lib/breadcrumb-page.directive';
export * from './lib/breadcrumb-link.directive';

export const HlmBreadCrumbImports = [
	HlmBreadcrumbComponent,
	HlmBreadcrumbEllipsisComponent,
	HlmBreadcrumbSeparatorComponent,
	HlmBreadcrumbItemDirective,
	HlmBreadcrumbLinkDirective,
	HlmBreadcrumbPageDirective,
	HlmBreadcrumbListDirective,
] as const;

@NgModule({
	imports: [...HlmBreadCrumbImports],
	exports: [...HlmBreadCrumbImports],
})
export class HlmBreadCrumbModule {}
