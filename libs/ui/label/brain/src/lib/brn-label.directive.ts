import { Directive, HostBinding, Input } from '@angular/core';

let nextId = 0;

@Directive({
	selector: '[brnLabel]',
	standalone: true,
})
export class BrnLabelDirective {
	id = `brn-label-${nextId++}`;

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('id') customId: string = '';

	@HostBinding('id')
	get elementId() {
		return this.customId || this.id;
	}
}
