import { Directive, Injector, type OnInit, effect, inject } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { SignalInputDirective, SignalInputErrorDirective } from 'ng-signal-forms';

@Directive({
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
					if (this._label) this._label.setError(true);
				} else {
					if (this._label) this._label.setError('auto');
				}
			},
			{
				injector: this._injector,
				allowSignalWrites: true,
			},
		);
	}
}
