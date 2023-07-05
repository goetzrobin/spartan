import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  Input,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { BrnDialogComponent, provideBrnDialog } from '@ng-spartan/ui/dialog/brain';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

export type BrnPopoverAlign = 'start' | 'center' | 'end';
@Component({
  selector: 'brn-popover',
  standalone: true,
  template: ` <ng-content />`,
  providers: [
    provideBrnDialog(),
    {
      provide: BrnDialogComponent,
      useExisting: forwardRef(() => BrnPopoverComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'brnPopover',
})
export class BrnPopoverComponent extends BrnDialogComponent {
  private readonly _sideOffset = signal(0);
  @Input()
  set sideOffset(value: NumberInput) {
    this._sideOffset.set(coerceNumberProperty(value));
  }

  private readonly _align = signal<BrnPopoverAlign>('center');
  @Input()
  set align(value: BrnPopoverAlign) {
    this._align.set(value);
  }

  constructor() {
    super();
    this.hasBackdrop = false;
    this.ariaDescribedBy = undefined;
    this.ariaLabelledBy = undefined;
    this.scrollStrategy = this.ssos.reposition();

    effect(() => {
      const align = this._align();
      this.attachPositions = [
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
      this.applySideOffset(untracked(this._sideOffset));
    });

    effect(() => {
      this.applySideOffset(this._sideOffset());
    });
  }

  private applySideOffset(sideOffset: number) {
    this.attachPositions = (this._options['attachPositions'] ?? []).map((position) => ({
      ...position,
      offsetY: position.originY === 'top' ? -sideOffset : sideOffset,
    }));
  }
}
