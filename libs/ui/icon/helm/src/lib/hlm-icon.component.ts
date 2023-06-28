import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, signal } from '@angular/core';
import { IconName, NgIconComponent } from '@ng-icons/core';
import { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-icon',
  standalone: true,
  imports: [NgIconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-icon
    [class]="userCls()"
    [name]="_name()"
    [size]="_size()"
    [color]="_color()"
    [strokeWidth]="_strokeWidth()"
  />`,
})
export class HlmIconComponent {
  protected readonly _name = signal<IconName | string>('');
  protected readonly _size = signal<string>('');
  protected readonly _color = signal<string | undefined>(undefined);
  protected readonly _strokeWidth = signal<string | number | undefined>(undefined);
  protected readonly userCls = signal<ClassValue>('');

  @Input({ required: true })
  set name(value: IconName | string) {
    this._name.set(value);
  }

  @Input()
  set size(value: string) {
    this._size.set(value);
  }

  @Input()
  set color(value: string | undefined) {
    this._color.set(value);
  }

  @Input()
  set strokeWidth(value: string | number | undefined) {
    this._strokeWidth.set(value);
  }

  @Input() set class(cls: ClassValue) {
    this.userCls.set(cls);
  }
}
