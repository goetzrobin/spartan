import { Directive, inject } from '@angular/core';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { BrnSelectGroupDirective } from './brn-select-group.directive';

@Directive({
	selector: '[brnSelectLabel]',
	hostDirectives: [BrnLabelDirective],
	standalone: true,
})
export class BrnSelectLabelDirective {
	private group = inject(BrnSelectGroupDirective);
	private label = inject(BrnLabelDirective, { host: true });

	constructor() {
		this.group.labelledBy = this.label.id;
	}
}
