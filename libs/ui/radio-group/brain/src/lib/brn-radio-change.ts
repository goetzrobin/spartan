import type { BrnRadioComponent } from './brn-radio.component';

export class BrnRadioChange {
	constructor(
		public source: BrnRadioComponent,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public value: any,
	) {}
}
