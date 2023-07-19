import { Directive, forwardRef, inject, Input, TemplateRef } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';
import { EXPOSES_STATE_TOKEN } from '@spartan-ng/ui/core/brain';

@Directive({
  selector: '[brnDialogContent]',
  standalone: true,
  providers: [
    {
      provide: EXPOSES_STATE_TOKEN,
      useExisting: forwardRef(() => BrnDialogContentDirective),
    },
  ],
})
export class BrnDialogContentDirective<T> {
  private _brnDialog = inject(BrnDialogComponent);
  private _template = inject(TemplateRef);
  public state = this._brnDialog.state;

  constructor() {
    this._brnDialog.registerTemplate(this._template);
  }
  @Input()
  set class(newClass: string | null | undefined) {
    this._brnDialog.setPanelClass(newClass);
  }

  @Input()
  set context(context: T) {
    this._brnDialog.setContext(context);
  }
}
