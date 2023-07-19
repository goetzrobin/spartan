import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core-brain';
import { BrnDialogOverlayComponent } from '@spartan-ng/ui-dialog-brain';

@Component({
  selector: 'brn-alert-dialog-overlay',
  standalone: true,
  providers: [
    {
      provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
      useExisting: forwardRef(() => BrnAlertDialogOverlayComponent),
    },
  ],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrnAlertDialogOverlayComponent extends BrnDialogOverlayComponent {}
