import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Input, type OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { NgControl } from '@angular/forms';

let nextId = 0;

@Directive({
	selector: '[brnLabel]',
	standalone: true,
	host: {
		'[id]': '_id()',
		'[class.ng-invalid]': 'this._ngControl?.invalid || null',
		'[class.ng-dirty]': 'this._ngControl?.dirty || null',
		'[class.ng-valid]': 'this._ngControl?.valid || null',
		'[class.ng-touched]': 'this._ngControl?.touched || null',
	},
})
export class BrnLabelDirective implements OnInit {
	protected readonly _id = signal(`brn-label-${nextId++}`);
	protected readonly _ngControl = inject(NgControl, { optional: true });

	@Input()
	set id(id: string) {
		this._id.set(id || this._id());
	}
	get id() {
		return this._id();
	}

	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _element = inject(ElementRef).nativeElement;
	private _changes?: MutationObserver;
	private readonly _dataDisabled = signal<boolean | 'auto'>('auto');
	public readonly dataDisabled = this._dataDisabled.asReadonly();

	ngOnInit(): void {
		if (!this._isBrowser) return;
		this._changes = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((mutation: MutationRecord) => {
				if (mutation.attributeName !== 'data-disabled') return;
				// eslint-disable-next-line
				const state = (mutation.target as any).attributes.getNamedItem(mutation.attributeName)?.value === 'true';
				this._dataDisabled.set(state ?? 'auto');
			});
		});
		this._changes?.observe(this._element, {
			attributes: true,
			childList: true,
			characterData: true,
		});
	}
}
