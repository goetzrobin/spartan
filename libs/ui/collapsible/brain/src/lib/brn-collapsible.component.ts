import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

let collapsibleContentIdSequence = 0;
export type BrnCollapsibleState = 'open' | 'closed';

@Component({
  selector: 'brn-collapsible',
  standalone: true,
  host: {
    '[attr.data-state]': 'state()',
    '[attr.disabled]': 'collapsibleDisabled()',
  },
  template: ` <ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrnCollapsibleComponent {
  private _cdr = inject(ChangeDetectorRef);
  state = signal<BrnCollapsibleState>('closed');
  contentId = signal('brn-collapsible-content-' + collapsibleContentIdSequence++);

  private _disabled = signal<true | undefined>(undefined);
  @Input()
  set disabled(value: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(value) ? true : undefined);
  }
  collapsibleDisabled = this._disabled.asReadonly();

  public toggle() {
    this.state.set(this.state() === 'closed' ? 'open' : 'closed');
    this._cdr.detectChanges();
  }
}
