import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';

@Component({
  selector: 'hlm-menu-item-check',
  standalone: true,
  providers: [provideIcons({ radixCheck })],
  imports: [HlmIconComponent],
  template: ` <hlm-icon size="none" class="h-full w-full" name="radixCheck" /> `,
})
export class HlmMenuItemCheckComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('group-[.checked]:opacity-100 opacity-0 inline-block mr-2 h-5 w-5', this._inputs);
  }
}
