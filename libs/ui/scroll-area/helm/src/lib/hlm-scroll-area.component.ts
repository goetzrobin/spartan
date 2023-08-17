import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-scroll-area',
  standalone: true,
  // imports: [NgScrollbarModule],
  template: `
    <!--    <ng-scrollbar-->
    <!--      [visibility]="visibility"-->
    <!--      [autoHeightDisabled]="autoHeightDisabled"-->
    <!--      [autoWidthDisabled]="autoWidthDisabled"-->
    <!--      [track]="track"-->
    <!--      [style]="{-->
    <!--        '&#45;&#45;scrollbar-border-radius': '100px',-->
    <!--        '&#45;&#45;scrollbar-padding': '1px',-->
    <!--        '&#45;&#45;scrollbar-thumb-color': 'hsl(var(&#45;&#45;border)',-->
    <!--        '&#45;&#45;scrollbar-thumb-hover-color': 'hsl(var(&#45;&#45;border)',-->
    <!--        '&#45;&#45;scrollbar-size': '7px'-->
    <!--      }"-->
    <!--    >-->
    <ng-content />
    <!--    </ng-scrollbar>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HlmScrollAreaComponent {
  @HostBinding('class')
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @Input()
  public track: 'vertical' | 'horizontal' | 'all' = 'all';
  @Input()
  autoHeightDisabled = false;
  @Input()
  autoWidthDisabled = false;
  @Input()
  visibility: 'hover' | 'always' | 'native' = 'native';

  private generateClasses() {
    return hlm('block', this._inputs);
  }
}
