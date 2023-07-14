import { Component, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'spartan-section-sub-heading',
  standalone: true,
  host: {
    class: 'block pb-2',
    '[class.-mt-12]': '_first',
  },
  template: `
    <h2 class="pt-12 font-heading border-border border-b text-2xl font-semibold tracking-tight">
      <ng-content />
    </h2>
  `,
})
export class SectionSubHeadingComponent {
  protected _first = false;
  @Input()
  set first(value: BooleanInput) {
    this._first = coerceBooleanProperty(value);
  }
}
