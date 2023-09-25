import { booleanAttribute, Component, Input, signal } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-trow',
  standalone: true,
  host: {
    '[class]': '_class()',
    role: 'row',
  },
  template: ` <ng-content /> `,
})
export class HlmTrowComponent {
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
    return hlm(
      'flex flex border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      this._inputs
    );
  }
}
