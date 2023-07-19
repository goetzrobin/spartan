import { Directive } from '@angular/core';
import { BrnDialogDescriptionDirective } from '@spartan-ng/ui/dialog/brain';

@Directive({
  selector: '[brnSheetDescription]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnSheetDescriptionDirective extends BrnDialogDescriptionDirective {}
