import { BrnRadioComponent } from './brn-radio.component';

export class BrnRadioChange {
  constructor(
    public source: BrnRadioComponent,
    public value: any,
  ) {}
}
