import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-page-bottom-nav-link',
	standalone: true,
	imports: [RouterLink, NgIf, HlmButtonDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
	template: `
		<a hlmBtn variant="outline" [routerLink]="routerLink" [relativeTo]="isAbsolute ? undefined : activatedRoute">
			<hlm-icon class="w-4 h-4 mr-2" name="lucideChevronLeft" *ngIf="direction === 'previous'" />
			{{ label }}
			<hlm-icon class="w-4 h-4 ml-2" name="lucideChevronRight" *ngIf="direction === 'next'" />
		</a>
	`,
})
export class PageBottomNavLinkComponent {
	protected activatedRoute = inject(ActivatedRoute);
	@Input()
	direction: 'previous' | 'next' = 'next';
	@Input()
	href = '';
	@Input()
	label = '';

	protected get isAbsolute() {
		return this.href.startsWith('/');
	}
	protected get routerLink() {
		return this.isAbsolute ? this.href : ['..', this.href];
	}
}
