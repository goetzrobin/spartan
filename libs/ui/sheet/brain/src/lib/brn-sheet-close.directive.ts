import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: 'button[brnSheetClose]',
  standalone: true,
})
export class BrnSheetCloseDirective extends BrnDialogCloseDirective {}
