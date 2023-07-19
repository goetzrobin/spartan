import { Directive, inject, Input, signal } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

let idSequence = 0;
@Directive({
  selector: 'button[brnDialogTrigger],button[brnDialogTriggerFor]',
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
  protected _brnDialog = inject(BrnDialogComponent, { optional: true });
  protected _id = signal('brn-dialog-trigger-' + idSequence++);
  state = this._brnDialog?.state ?? signal('closed');
  dialogId = 'brn-dialog-' + (this._brnDialog?.dialogId ?? idSequence++);

  @Input()
  set id(newId: string) {
    this._id.set(newId);
  }

  @Input()
  set brnDialogTriggerFor(brnDialog: BrnDialogComponent) {
    this._brnDialog = brnDialog;
  }
  open() {
    this._brnDialog?.open();
  }
}
