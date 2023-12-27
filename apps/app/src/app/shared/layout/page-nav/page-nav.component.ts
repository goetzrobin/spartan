import {
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	TemplateRef,
	ViewChild,
	inject,
	isDevMode,
	signal,
} from '@angular/core';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { pageNavTmpl } from '~/app/shared/layout/page-nav/page-nav-outlet.component';
import { PageNavLinkComponent } from './page-nav-link.component';

type SamePageAnchorLink = {
	id: string;
	label: string;
};

@Component({
	selector: 'spartan-page-nav',
	standalone: true,
	imports: [HlmScrollAreaComponent, PageNavLinkComponent],
	host: {
		class: 'hidden xl:block text-sm',
	},
	template: `
		<ng-template #pageNav>
			<hlm-scroll-area class="h-[calc(100vh-3.5rem)]">
				<div class="space-y-2 px-1">
					<h3 class="font-medium">On this page</h3>
					<ul class="m-0 flex list-none flex-col">
						<ng-content />
						@for (link of links(); track link.id) {
							<spartan-page-nav-link [fragment]="link.id" [label]="link.label" />
						} @empty {
							@if (isDevMode()) {
								[DEV] Nothing to see here!
							}
						}
					</ul>
				</div>
			</hlm-scroll-area>
		</ng-template>
	`,
})
export class PageNavComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('pageNav', { static: true })
	pageNavTpl?: TemplateRef<unknown>;

	isDevMode = signal(isDevMode());
	links = signal<SamePageAnchorLink[]>([]);

	private page: HTMLElement = (inject(ElementRef).nativeElement as HTMLElement).previousSibling as HTMLElement;

	ngOnInit() {
		const headings = Array.from(this.page.querySelectorAll('spartan-section-sub-heading'));
		const links = headings.map(({ id, children }) => ({
			id,
			label: children[0].childNodes[0].textContent ?? '[DEV] Empty heading!',
		}));
		this.links.set(links);
	}
	ngAfterViewInit() {
		if (!this.pageNavTpl) return;
		pageNavTmpl.set(this.pageNavTpl);
	}
	ngOnDestroy() {
		pageNavTmpl.set(null);
	}
}
