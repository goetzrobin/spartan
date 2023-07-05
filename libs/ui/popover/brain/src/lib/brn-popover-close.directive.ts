import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: 'button[brnPopoverClose]',
  standalone: true,
})
export class BrnPopoverCloseDirective extends BrnDialogCloseDirective {}
