import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';


@Component({
  selector: 'hlm-skeleton',
  standalone: true,
  template: ``
})
export class HlmSkeletonComponent {
  private _inputs: ClassValue = '';

  @Input()
  set class(labels: ClassValue) {
    this._inputs = labels;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm('block animate-pulse rounded-md bg-muted', this._inputs);
  }
}
