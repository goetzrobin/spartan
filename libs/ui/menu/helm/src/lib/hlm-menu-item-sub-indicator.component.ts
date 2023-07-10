import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixChevronRight } from '@ng-icons/radix-icons';

@Component({
  selector: 'hlm-menu-item-sub-indicator',
  standalone: true,
  providers: [provideIcons({ radixChevronRight })],
  imports: [NgIconComponent],
  template: ` <ng-icon name="radixChevronRight" /> `,
})
export class HlmMenuItemSubIndicatorComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('inline-block ml-auto h-4 w-4', this._inputs);
  }
}
