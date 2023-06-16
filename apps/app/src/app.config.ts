import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { provideTRPCClient } from './trpc-client';
import { PreloadAllModules, withNavigationErrorHandler, withPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withNavigationErrorHandler(console.log),
      withPreloading(PreloadAllModules)
      ),
       provideClientHydration(), 
       provideTRPCClient()]
};
