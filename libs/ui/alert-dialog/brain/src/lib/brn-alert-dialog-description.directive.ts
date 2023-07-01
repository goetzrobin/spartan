import { Directive } from '@angular/core';
import { BrnDialogDescriptionDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: '[brnAlertDialogDescription]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnAlertDialogDescriptionDirective extends BrnDialogDescriptionDirective {}
