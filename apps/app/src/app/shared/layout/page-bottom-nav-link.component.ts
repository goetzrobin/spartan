import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixChevronLeft, radixChevronRight } from '@ng-icons/radix-icons';
import { NgIf } from '@angular/common';

@Component({
  selector: 'spartan-page-bottom-nav-link',
  standalone: true,
  imports: [RouterLink, NgIf, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ radixChevronRight, radixChevronLeft })],
  template: `
    <a hlmBtn variant="outline" [routerLink]="['..', href]" [relativeTo]="activatedRoute">
      <hlm-icon class="mr-2 h-4 w-4" name="radixChevronLeft" *ngIf="direction === 'previous'" />
      {{ label }}
      <hlm-icon class="ml-2 h-4 w-4" name="radixChevronRight" *ngIf="direction === 'next'" />
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
}
