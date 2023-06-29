import { Component, inject } from '@angular/core';
import { BrnProgressComponent } from './brn-progress.component';

@Component({
  selector: 'brn-progress-indicator',
  standalone: true,
  template: '',
  host: {
    '[attr.data-state]': 'progressState()',
    '[attr.data-value]': 'value() ?? undefined',
    '[attr.data-max]': 'max()',
  },
})
export class BrnProgressIndicatorComponent {
  private readonly _parent = inject(BrnProgressComponent);
  protected readonly progressState = this._parent.progressState;
  protected readonly max = this._parent.$max;
  protected readonly value = this._parent.$value;
}
