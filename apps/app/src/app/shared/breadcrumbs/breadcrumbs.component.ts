import { ChangeDetectionStrategy, Component, HostBinding, inject, ViewEncapsulation } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { radixChevronRight } from '@ng-icons/radix-icons';
import { NgForOf, NgIf } from '@angular/common';
import { BreadcrumbService } from '~/app/shared/breadcrumbs/breadcrumb.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  providers: [provideIcons({ radixChevronRight })],
  template: `
    <ng-container *ngIf="breadcrumbs() as breadcrumbs">
      <nav
        *ngIf="breadcrumbs && breadcrumbs.length > 0"
        class="mb-4 flex items-center space-x-1 text-sm text-muted-foreground"
      >
        <a [href]="breadcrumbs[0].url" [routerLink]="breadcrumbs[0].url">{{ breadcrumbs[0].label }}</a>
        <ng-container *ngFor="let breadcrumb of breadcrumbs.slice(1, breadcrumbs.length); let last = last">
          <hlm-icon class="h-4 w-4" name="radixChevronRight" />
          <a
            [class]="last ? 'text-foreground' : 'text-muted-foreground'"
            [href]="breadcrumb.url"
            [routerLink]="breadcrumb.url"
            >{{ breadcrumb.loading ? breadcrumb.loadingLabel : breadcrumb.label }}</a
          >
        </ng-container>
      </nav>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  public breadcrumbs = toSignal(inject(BreadcrumbService).breadcrumbs$);

  @HostBinding('class')
  public class = '';
}
