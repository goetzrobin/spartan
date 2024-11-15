import { Directive, inject } from '@angular/core';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { BrnSelectGroupDirective } from './brn-select-group.directive';

@Directive({
	selector: '[brnSelectLabel]',
	hostDirectives: [BrnLabelDirective],
	standalone: true,
})
export class BrnSelectLabelDirective {
	private readonly _group = inject(BrnSelectGroupDirective, { optional: true });
	private readonly _label = inject(BrnLabelDirective, { host: true });

	constructor() {
		this._group?.labelledBy.set(this._label.id());
	}
}
