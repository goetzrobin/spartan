import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: 'button[brnAlertDialogClose]',
  standalone: true,
})
export class BrnAlertDialogCloseDirective extends BrnDialogCloseDirective {}
