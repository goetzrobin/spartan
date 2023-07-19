import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@spartan-ng/ui/dialog/brain';

@Directive({
  selector: '[brnAlertDialogTitle]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnAlertDialogTitleDirective extends BrnDialogTitleDirective {}
