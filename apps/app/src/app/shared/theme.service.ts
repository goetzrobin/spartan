import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { combineLatest, ReplaySubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MediaMatcher } from '@angular/cdk/layout';

const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(RendererFactory2).createRenderer(null, null);
  private _document = inject(DOCUMENT);
  private _query = inject(MediaMatcher).matchMedia('(prefers-color-scheme: dark)');
  private _theme$ = new ReplaySubject<'light' | 'dark' | 'system'>(1);
  private _systemTheme$ = new ReplaySubject<'light' | 'dark' | 'system'>(1);
  public theme$ = this._theme$.asObservable();

  constructor() {
    this._systemTheme$.next(this._query.matches ? 'dark' : 'light');
    this._query.onchange = (e: MediaQueryListEvent) => this._systemTheme$.next(e.matches ? 'dark' : 'light');
    this.syncThemeFromLocalStorage();
    this.toggleClassOnThemeChanges();
  }

  private syncThemeFromLocalStorage(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._theme$.next((localStorage.getItem('theme') as Theme) ?? 'system');
    }
  }
  private toggleClassOnThemeChanges(): void {
    combineLatest([this.theme$, this._systemTheme$])
      .pipe(takeUntilDestroyed())
      .subscribe(([theme, systemTheme]) => {
        if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
          this._renderer.addClass(this._document.documentElement, 'dark');
        } else {
          if (this._document.documentElement.className.includes('dark')) {
            this._renderer.removeClass(this._document.documentElement, 'dark');
          }
        }
      });
  }
  public setTheme(newTheme: Theme): void {
    localStorage.setItem('theme', newTheme);
    this._theme$.next(newTheme);
  }
}
