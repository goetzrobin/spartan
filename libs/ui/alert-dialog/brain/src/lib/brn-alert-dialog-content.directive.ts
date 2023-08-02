import { Directive, forwardRef } from '@angular/core';
import { EXPOSES_STATE_TOKEN } from '@spartan-ng/ui-core';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';

@Directive({
  selector: '[brnAlertDialogContent]',
  standalone: true,
  providers: [
    {
      provide: EXPOSES_STATE_TOKEN,
      useExisting: forwardRef(() => BrnAlertDialogContentDirective),
    },
  ],
})
export class BrnAlertDialogContentDirective<T> extends BrnDialogContentDirective<T> {}
