import { Directive, effect, inject, Injector, OnInit } from '@angular/core';
import { SignalInputDirective, SignalInputErrorDirective } from 'ng-signal-forms';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngModel][formField]',
  hostDirectives: [SignalInputErrorDirective],
  standalone: true,
})
export class SpartanInputErrorDirective implements OnInit {
  private _injector = inject(Injector);
  private _label = inject(HlmLabelDirective, { skipSelf: true, optional: true });
  private readonly _signalInput = inject(SignalInputDirective, { optional: true });

  ngOnInit() {
    effect(
      () => {
        if (
          this._signalInput?.formField?.touchedState() === 'TOUCHED' &&
          Object.values(this._signalInput?.formField?.errors() ?? {}).length > 0
        ) {
          if (this._label) this._label.error = true;
        } else {
          if (this._label) this._label.error = 'auto';
        }
      },
      {
        injector: this._injector,
      }
    );
  }
}
