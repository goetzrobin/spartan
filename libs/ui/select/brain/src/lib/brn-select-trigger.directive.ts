import { Directive, ElementRef, computed, inject } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnSelectTrigger]',
	standalone: true,
	host: {
		role: 'combobox',
		'[attr.id]': 'selectTriggerId()',
		'[disabled]': 'selectDisable()',
		'[attr.aria-expanded]': 'isExpanded()',
		'[attr.aria-controls]': "selectContentId() + ''",
		'[attr.aria-labelledBy]': 'selectTriggerLabelledBy()',
		'aria-autocomplete': 'none',
		'[attr.dir]': 'ltr',
		type: 'button',
	},
})
export class BrnSelectTriggerDirective {
	private _selectService = inject(BrnSelectService);

	readonly isExpanded = this._selectService.isExpanded;

	readonly selectTriggerId = computed(() => `${this._selectService.id()}--trigger`);
	readonly selectContentId = computed(() => `${this._selectService.id()}--content`);

	readonly selectTriggerLabelledBy = computed(() => {
		if (this._selectService.value().length > 0) {
			return `${this._selectService.labelId()} ${this._selectService.id()}--value`;
		}
		return this._selectService.labelId();
	});
	readonly selectDisable = computed(() => this._selectService.disabled());

	constructor(private el: ElementRef) {}

	focus() {
		this.el.nativeElement.focus();
	}
}
