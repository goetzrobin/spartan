import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import { appConfig } from './app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
