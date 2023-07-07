import { Directive, Input } from '@angular/core';
import { EventType, NavigationEnd, NavigationSkipped } from '@angular/router';
import { injectActivatedRoute, injectRouter } from '@analogjs/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[spartanRedirect]',
  standalone: true,
})
export class RedirectDirective {
  @Input()
  endsWith = '';
  @Input()
  commands: string[] = [];
  private _router = injectRouter();
  private _route = injectActivatedRoute();
  constructor() {
    this._router.events
      .pipe(
        filter((e) => e.type === EventType.NavigationEnd || e.type === EventType.NavigationSkipped),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        if (!(e as NavigationEnd | NavigationSkipped).url.endsWith(this.endsWith) || this.commands.length === 0) return;
        this._router.navigate(this.commands, { relativeTo: this._route });
      });
  }
}
