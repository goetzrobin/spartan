import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkFooterCellDef, CdkHeaderCellDef, CdkTableModule } from '@angular/cdk/table';
import { BrnCellDefDirective } from './brn-cell-def.directive';
import { BrnFooterDefDirective } from './brn-footer-def.directive';
import { BrnHeaderDefDirective } from './brn-header-def.directive';

@Component({
  selector: 'brn-column-def',
  standalone: true,
  imports: [CdkTableModule],
  template: `
    <ng-container [cdkColumnDef]="name">
      <ng-content select="[brnHeaderDef]" />
      <ng-content select="[brnCellDef]" />
      <ng-content select="[brnFooterDef]" />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrnColumnDefComponent implements AfterContentChecked {
  get columnDef() {
    return this._columnDef;
  }

  get cell() {
    return this._columnDef.cell;
  }

  private _name = '';
  @Input()
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    if (!this._columnDef) return;
    this._columnDef.name = value;
  }

  @ViewChild(CdkColumnDef, { static: true })
  private _columnDef!: CdkColumnDef;

  @ContentChild(BrnCellDefDirective, { static: true })
  private _cellDef?: CdkCellDef;
  @ContentChild(BrnFooterDefDirective, { static: true })
  private _footerCellDef?: CdkFooterCellDef;
  @ContentChild(BrnHeaderDefDirective, { static: true })
  private _headerCellDef?: CdkHeaderCellDef;

  public ngAfterContentChecked(): void {
    this._columnDef.name = this.name;
    if (this._cellDef) {
      this._columnDef.cell = this._cellDef;
    }
    if (this._headerCellDef) {
      this._columnDef.headerCell = this._headerCellDef;
    }
    if (this._footerCellDef) {
      this._columnDef.footerCell = this._footerCellDef;
    }
  }
}
