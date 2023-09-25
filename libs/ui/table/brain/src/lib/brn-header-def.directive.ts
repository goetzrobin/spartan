import { Directive, TemplateRef } from '@angular/core';
import { CdkHeaderCellDef } from '@angular/cdk/table';

@Directive({
  standalone: true,
  selector: '[brnHeaderDef]',
  exportAs: 'brnHeaderDef',
})
export class BrnHeaderDefDirective extends CdkHeaderCellDef {
  constructor(public override template: TemplateRef<unknown>) {
    super(template);
  }
}
