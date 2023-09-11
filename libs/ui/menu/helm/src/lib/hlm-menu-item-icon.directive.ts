import { Directive, HostBinding, inject, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Directive({
  selector: '[hlmMenuIcon]',
  standalone: true,
})
export class HlmMenuItemIconDirective {
  private _menuIcon = inject(HlmIconComponent, { host: true, optional: true });

  constructor() {
    if (!this._menuIcon) return;
    this._menuIcon.size = 'none';
  }
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('mr-2 h-4 w-4', this._inputs);
  }
}
