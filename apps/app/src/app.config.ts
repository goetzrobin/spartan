import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { provideTrpcClient } from './trpc-client';
import { PreloadAllModules, withInMemoryScrolling, withNavigationErrorHandler, withPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withNavigationErrorHandler(console.log),
      withPreloading(PreloadAllModules)
    ),
    provideClientHydration(),
    provideTrpcClient(),
  ],
};
