import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';
import { radixChevronRight } from '@ng-icons/radix-icons';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'hlm-menu-item-sub-indicator',
  standalone: true,
  providers: [provideIcons({ radixChevronRight })],
  imports: [HlmIconComponent],
  template: ` <hlm-icon size="none" class="h-full w-full" name="radixChevronRight" /> `,
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
