import { booleanAttribute, Component, Input, signal } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-td',
  standalone: true,
  imports: [NgTemplateOutlet, NgIf],
  host: {
    '[class]': '_class()',
  },
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
    <span *ngIf="truncate" class="flex-1 truncate">
      <ng-container [ngTemplateOutlet]="content" />
    </span>
    <ng-container *ngIf="!truncate" [ngTemplateOutlet]="content" />
  `,
})
export class HlmTdComponent {
  protected readonly _class = signal(this.generateClasses());

  @Input({ transform: booleanAttribute })
  public truncate = false;

  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class.set(this.generateClasses());
  }

  private generateClasses() {
    return hlm('flex flex-none p-2 items-center [&:has([role=checkbox])]:pr-0', this._inputs);
  }
}
