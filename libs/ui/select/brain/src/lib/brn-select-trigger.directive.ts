import { Directive, ElementRef, OnDestroy, computed, inject } from '@angular/core';
import { Subject } from 'rxjs';
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
	},
})
export class BrnSelectTriggerDirective implements OnDestroy {
	unsubscribe = new Subject<boolean>();

	private _selectService = inject(BrnSelectService);

	readonly isExpanded = this._selectService.isExpanded;

	readonly selectTriggerId = computed(() => `${this._selectService.id()}--trigger`);
	readonly selectContentId = computed(() => `${this._selectService.id()}--content`);

	readonly selectDisable = this._selectService.disabled;

	constructor(private el: ElementRef) {}

	focus() {
		this.el.nativeElement.focus();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next(true);
		this.unsubscribe.complete();
	}
}
