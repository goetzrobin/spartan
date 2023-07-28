import { NgModule } from '@angular/core';
import { BrnSeparatorComponent } from './lib/brn-separator.component';

export * from './lib/brn-separator.component';

@NgModule({
  imports: [BrnSeparatorComponent],
  exports: [BrnSeparatorComponent],
})
export class BrnSeparatorModule {}
