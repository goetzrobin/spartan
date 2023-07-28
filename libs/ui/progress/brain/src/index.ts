import { NgModule } from '@angular/core';

import { BrnProgressComponent } from './lib/brn-progress.component';
import { BrnProgressIndicatorComponent } from './lib/brn-progress-indicator.component';

export * from './lib/brn-progress.component';
export * from './lib/brn-progress-indicator.component';

export const BrnProgressImports = [BrnProgressComponent, BrnProgressIndicatorComponent] as const;

@NgModule({
  imports: [...BrnProgressImports],
  exports: [...BrnProgressImports],
})
export class BrnProgressModule {}
