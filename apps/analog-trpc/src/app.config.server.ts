import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {provideFileRouter} from "@analogjs/router";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideFileRouter(),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
