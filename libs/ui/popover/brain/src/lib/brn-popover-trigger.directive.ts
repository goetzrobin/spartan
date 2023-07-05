import { Directive, ElementRef, inject } from '@angular/core';
import { BrnDialogTriggerDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: 'button[brnPopoverTrigger]',
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
export class BrnPopoverTriggerDirective extends BrnDialogTriggerDirective {
  private _host = inject(ElementRef);
  constructor() {
    super();
    this._brnDialog.attachTo = this._host.nativeElement;
  }
}
