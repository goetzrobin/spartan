import { mergeApplicationConfig, type ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
	providers: [provideServerRendering(), provideClientHydration()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
