import { NgModule } from '@angular/core';
import { HlmScrollAreaComponent } from './lib/hlm-scroll-area.component';

export * from './lib/hlm-scroll-area.component';

@NgModule({
	imports: [HlmScrollAreaComponent],
	exports: [HlmScrollAreaComponent],
})
export class HlmScrollAreaModule {}
