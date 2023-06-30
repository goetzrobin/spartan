import { Directive, inject, Input, signal } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

let idSequence = 0;
@Directive({
  selector: 'button[brnDialogTrigger]',
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
export class BrnDialogTriggerDirective {
  private _brnDialog = inject(BrnDialogComponent);
  protected _id = signal('brn-dialog-trigger-' + idSequence++);
  state = this._brnDialog.state;
  dialogId = 'brn-dialog-' + this._brnDialog.dialogId;

  @Input()
  set id(newId: string) {
    this._id.set(newId);
  }
  open() {
    this._brnDialog.open();
  }
}
