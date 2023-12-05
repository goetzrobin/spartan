import { CdkListbox, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnSelectContent]',
	standalone: true,
	hostDirectives: [CdkListbox],
	host: {
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'-trigger'",
	},
})
export class BrnSelectContentDirective implements OnInit {
	private _cdkListbox = inject(CdkListbox, { host: true });

	private _selectService = inject(BrnSelectService);

	labelledBy = this._selectService.labelId;

	id = this._selectService.id;

	constructor() {
		this._cdkListbox.valueChange
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				tap((val: ListboxValueChangeEvent<unknown>) => {
					console.log(val);
					this._selectService.listBoxValueChangeEvent$.next(val);
				}),
			)
			.subscribe();
	}

	ngOnInit(): void {
		if (this._selectService.multiple()) {
			this._cdkListbox.multiple = true;
		}
	}

	focusList(): void {
		this._cdkListbox.focus();
	}
}
