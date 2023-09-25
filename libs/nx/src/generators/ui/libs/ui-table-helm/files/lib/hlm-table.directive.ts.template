import { Directive } from '@angular/core';
import { injectTableClassesSettable } from '@spartan-ng/ui-core';

@Directive({ standalone: true, selector: '[hlmTable],brn-table[hlm]' })
export class HlmTableDirective {
  private _tableClassesSettable = injectTableClassesSettable({ host: true, optional: true });

  constructor() {
    this._tableClassesSettable?.setTableClasses({
      table: 'flex flex-col [&_cdk-row:last-child]:border-0',
      headerRow:
        'flex  min-w-[100%] w-fit border-b border-border [&.cdk-table-sticky]:bg-background [&.cdk-table-sticky]:hover:bg-muted',
      bodyRow:
        'flex min-w-[100%] w-fit border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    });
  }
}
