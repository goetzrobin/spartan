import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

@Directive({
  selector: '[brnDialogTitle]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnDialogTitleDirective {
  private _dialog = inject(BrnDialogComponent);
  protected _id = signal('brn-dialog-title-' + this._dialog.dialogId);
  constructor() {
    effect(() => {
      this._dialog.setAriaLabelledBy(this._id());
    });
  }
}
