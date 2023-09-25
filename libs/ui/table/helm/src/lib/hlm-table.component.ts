import { booleanAttribute, Component, Input, signal } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-table',
  standalone: true,
  host: {
    '[class]': '_class()',
    role: 'table',
  },
  template: ` <ng-content /> `,
})
export class HlmTableComponent {
  protected readonly _class = signal(this.generateClasses());

  @Input({ transform: booleanAttribute })
  public truncate = false;

  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class.set(this.generateClasses());
  }

  private generateClasses() {
    return hlm('flex flex-col [&_hlm-trow:last-child]:border-0', this._inputs);
  }
}
