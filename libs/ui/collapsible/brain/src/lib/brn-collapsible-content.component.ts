import { type AfterContentInit, Component, ElementRef, Input, computed, inject, signal } from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

@Component({
	selector: 'brn-collapsible-content',
	standalone: true,
	host: {
		'[hidden]': 'state() === "closed"',
		'[attr.data-state]': 'state()',
		'[style]': 'computedStyles()',
		'[id]': 'contentId()',
	},
	template: `
		<ng-content />
	`,
})
export class BrnCollapsibleContentComponent implements AfterContentInit {
	private _collapsible = inject(BrnCollapsibleComponent, { optional: true });
	private _elementRef = inject(ElementRef);
	private readonly _height = signal(0);
	private readonly _width = signal(0);
	public contentId = this._collapsible?.contentId ?? signal(undefined).asReadonly;

	state = this._collapsible?.state ?? signal('closed').asReadonly();
	computedStyles = computed(() => {
		const height = this._height();
		const width = this._width();
		return {
			'--radix-collapsible-content-height': height ? `${height}px` : undefined,
			'--radix-collapsible-content-width': width ? `${width}px` : undefined,
		};
	});

	@Input()
	set id(value: string | null | undefined) {
		if (!value || !this._collapsible) return;
		this._collapsible.contentId.set(value);
	}
	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	ngAfterContentInit() {
		if (typeof this._elementRef.nativeElement.getBoundingClientRect !== 'function') return;
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		if (!rect) return;
		this._width.set(rect.width);
		this._height.set(rect.height);
	}
}
