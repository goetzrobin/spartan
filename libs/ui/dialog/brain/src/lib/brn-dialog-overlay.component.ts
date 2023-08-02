import { ChangeDetectionStrategy, Component, forwardRef, inject, Input, ViewEncapsulation } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';
import { SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core';

@Component({
  selector: 'brn-dialog-overlay',
  standalone: true,
  providers: [
    {
      provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
      useExisting: forwardRef(() => BrnDialogOverlayComponent),
    },
  ],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrnDialogOverlayComponent {
  private _brnDialog = inject(BrnDialogComponent);
  @Input()
  set class(newClass: string | null | undefined) {
    this._brnDialog.setOverlayClass(newClass);
  }
  setClassToCustomElement(newClass: string) {
    this._brnDialog.setOverlayClass(newClass);
  }
}
