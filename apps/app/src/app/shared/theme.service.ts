import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // A. Setting up our dependencies
  // A.1 since we will access localStorage with AnalogJS
  // (which can be used for server side rendering)
  // we will use the PLATFORM_ID to see if we are executing in the browser and
  // it is available
  private _platformId = inject(PLATFORM_ID);
  // A.2 we use Angular's renderer to add/remove the dark class from the html element
  private _renderer = inject(RendererFactory2).createRenderer(null, null);
  // A.3 we use Angular's DOCUMENT injection token to avoid directly accessing the document object
  private _document = inject(DOCUMENT);

  // B. Initializing our in memory theme store
  // B.1 we want to give every subscriber the current value of our theme
  // even if they subscribe after the first value was emitted
  private _theme$ = new ReplaySubject<'light' | 'dark'>(1);
  // B.2 we expose the current theme so our app can access it and e.g. show
  // a different icon for the button to toggle it
  public theme$ = this._theme$.asObservable();

  // C. Sync and listen to theme changes on service creation
  constructor() {
    // we check the current value in the localStorage to see what theme was set
    // by the code in the index.html file and load that into our _theme$ replaysubject
    this.syncThemeFromLocalStorage();
    // we also immediately subscribe to our theme$ variable and add/remove
    // the dark class from the html element
    this.toggleClassOnThemeChanges();
  }

  // C.1 sync with the theme set in the localStorage by our index.html script tag
  private syncThemeFromLocalStorage(): void {
    // if we are in the browser we know we have access to localstorage
    if (isPlatformBrowser(this._platformId)) {
      // we load the appropriate value from the localStorage into our _theme$ replaysubject
      this._theme$.next(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    }
  }

  // C.2 Subscribe to theme changes until the service is destroyed
  // and add/remove class from html element
  private toggleClassOnThemeChanges(): void {
    // until our service is destroyed we subscribe to all changes in the theme$ variable
    this.theme$.pipe(takeUntilDestroyed()).subscribe((theme) => {
      // if it is dark we add the dark class to the html element
      if (theme === 'dark') {
        this._renderer.addClass(this._document.documentElement, 'dark');
      } else {
        // else if is added already, we remove it
        if (this._document.documentElement.className.includes('dark')) {
          this._renderer.removeClass(this._document.documentElement, 'dark');
        }
      }
    });
  }

  // D. Expose a public function that allows us to change the theme from anywhere in our application
  public toggle(): void {
    const newTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._theme$.next(newTheme);
  }
}
