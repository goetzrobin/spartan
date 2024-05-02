import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BreadcrumbService } from './breadcrumb.service';

export interface Breadcrumb {
	label: string;
	url: string;
	loading: boolean;
	loadingLabel?: string;
}

@Component({
	selector: 'spartan-breadcrumbs',
	standalone: true,
	imports: [RouterLink, HlmIconComponent, NgIf, NgForOf],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<ng-container *ngIf="breadcrumbs() as breadcrumbs">
			<nav
				*ngIf="breadcrumbs && breadcrumbs.length > 0"
				class="flex items-center mb-4 text-sm text-muted-foreground space-x-1"
			>
				<a
					class="rounded focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2"
					[href]="breadcrumbs[0].url"
					[routerLink]="breadcrumbs[0].url"
				>
					{{ breadcrumbs[0].label }}
				</a>
				<ng-container *ngFor="let breadcrumb of breadcrumbs.slice(1, breadcrumbs.length); let last = last">
					<hlm-icon class="w-4 h-4" name="lucideChevronRight" />
					<a
						class="rounded focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2"
						[class]="last ? 'text-foreground' : 'text-muted-foreground'"
						[href]="breadcrumb.url"
						[routerLink]="breadcrumb.url"
					>
						{{ breadcrumb.loading ? breadcrumb.loadingLabel : breadcrumb.label }}
					</a>
				</ng-container>
			</nav>
		</ng-container>
	`,
	encapsulation: ViewEncapsulation.Emulated,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: '',
	},
})
export class BreadcrumbsComponent {
	public breadcrumbs = toSignal(inject(BreadcrumbService).breadcrumbs$);
}
