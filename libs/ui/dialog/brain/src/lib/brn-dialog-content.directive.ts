import { Directive, Input, TemplateRef, computed, inject } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/ui-core';
import { BrnDialogRef } from './brn-dialog-ref';
import { BrnDialogComponent } from './brn-dialog.component';

@Directive({
	selector: '[brnDialogContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnDialogContentDirective)],
})
export class BrnDialogContentDirective<T> {
	private readonly _brnDialog = inject(BrnDialogComponent, { optional: true });
	private readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });
	private readonly _template = inject(TemplateRef);
	public readonly state = computed(() => this._brnDialog?.state() ?? this._brnDialogRef?.state() ?? 'closed');

	constructor() {
		if (!this._brnDialog) return;
		this._brnDialog.registerTemplate(this._template);
	}

	@Input()
	set class(newClass: string | null | undefined) {
		if (!this._brnDialog) return;
		this._brnDialog.setPanelClass(newClass);
	}

	@Input()
	set context(context: T) {
		if (!this._brnDialog) return;
		this._brnDialog.setContext(context);
	}
}
