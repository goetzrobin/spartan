import { Directive, inject, Input } from '@angular/core';
import { BrnDialogTriggerDirective } from '@ng-spartan/ui/dialog/brain';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
  selector: 'button[brnSheetTrigger]',
  standalone: true,
  host: {
    '[id]': '_id()',
    '(click)': 'open()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
    '[attr.data-state]': 'state()',
    '[attr.aria-controls]': 'dialogId',
  },
})
export class BrnSheetTriggerDirective extends BrnDialogTriggerDirective {
  private _sheet = inject(BrnSheetComponent, { optional: true });
  @Input()
  side: 'top' | 'bottom' | 'left' | 'right' | undefined;

  override open() {
    if (this._sheet && this.side) {
      this._sheet.setSide = this.side;
    }
    super.open();
  }
}
