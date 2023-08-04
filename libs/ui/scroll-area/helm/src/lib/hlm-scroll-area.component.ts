import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-scroll-area',
  standalone: true,
  imports: [NgScrollbarModule],
  template: `
    <ng-scrollbar
      [visibility]="visibility"
      [autoHeightDisabled]="autoHeightDisabled"
      [autoWidthDisabled]="autoWidthDisabled"
      [track]="track"
      [style]="{
        '--scrollbar-border-radius': '100px',
        '--scrollbar-padding': '1px',
        '--scrollbar-thumb-color': 'hsl(var(--border)',
        '--scrollbar-thumb-hover-color': 'hsl(var(--border)',
        '--scrollbar-size': '7px'
      }"
    >
      <ng-content />
    </ng-scrollbar>
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
