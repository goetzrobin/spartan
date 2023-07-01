import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@ng-spartan/ui/dialog/brain';

@Directive({
  selector: '[brnSheetTitle]',
  standalone: true,
  host: {
    '[id]': '_id()',
  },
})
export class BrnSheetTitleDirective extends BrnDialogTitleDirective {}
