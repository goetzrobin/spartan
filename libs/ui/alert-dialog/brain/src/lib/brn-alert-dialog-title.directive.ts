import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: '[brnAlertDialogTitle]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnAlertDialogTitleDirective extends BrnDialogTitleDirective {}
