import { Directive, effect, inject, Input, signal } from '@angular/core';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';

export type BrnCtxMenuAlign = 'start' | 'center' | 'end' | undefined;

@Directive({
  selector: '[brnCtxMenuTriggerFor]',
  standalone: true,
  hostDirectives: [{ directive: CdkContextMenuTrigger, inputs: ['cdkContextMenuTriggerFor: brnCtxMenuTriggerFor'] }],
})
export class BrnContextMenuTriggerDirective {
  private readonly _cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
  private readonly _align = signal<BrnCtxMenuAlign>(undefined);
  @Input()
  set align(value: BrnCtxMenuAlign) {
    this._align.set(value);
  }

  constructor() {
    effect(() => {
      const align = this._align();
      if (!align) return;
      this._cdkTrigger.menuPosition = [
        {
          originX: align,
          originY: 'bottom',
          overlayX: align,
          overlayY: 'top',
        },
        {
          originX: align,
          originY: 'top',
          overlayX: align,
          overlayY: 'bottom',
        },
      ];
    });
  }
}
