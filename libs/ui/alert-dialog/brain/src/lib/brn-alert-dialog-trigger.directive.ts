import { Directive } from '@angular/core';
import { BrnDialogTriggerDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: 'button[brnAlertDialogTrigger]',
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
export class BrnAlertDialogTriggerDirective extends BrnDialogTriggerDirective {}
