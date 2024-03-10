import { computed, Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
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
		'[attr.dir]': '_selectService.dir()',
		'[class.ng-invalid]': 'this._ngControl?.invalid || null',
		'[class.ng-dirty]': 'this._ngControl?.dirty || null',
		'[class.ng-valid]': 'this._ngControl?.valid || null',
		'[class.ng-touched]': 'this._ngControl?.touched || null',
		type: 'button',
	},
})
export class BrnSelectTriggerDirective {
	private readonly el = inject(ElementRef);
	protected readonly _selectService = inject(BrnSelectService);
	protected readonly _ngControl = inject(NgControl, { optional: true });

	public readonly isExpanded = this._selectService.isExpanded;
	public readonly selectTriggerId = computed(() => `${this._selectService.id()}--trigger`);
	public readonly selectContentId = computed(() => `${this._selectService.id()}--content`);
	public readonly selectDisable = computed(() => this._selectService.disabled());
	public readonly selectTriggerLabelledBy = computed(() => {
		if (this._selectService.value().length > 0) {
			return `${this._selectService.labelId()} ${this._selectService.id()}--value`;
		}
		return this._selectService.labelId();
	});

	constructor() {
		if (!this._selectService) return;
		this._selectService._setSelectTrigger(this);
	}

	public focus() {
		this.el.nativeElement.focus();
	}
}
