import { computed, Directive, effect, inject, input, TemplateRef } from '@angular/core';
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

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	private readonly _classEffect = effect(() => {
		if (!this._brnDialog) return;
		const newClass = this.className();
		this._brnDialog.setPanelClass(newClass);
	});

	public readonly context = input<T | undefined>(undefined);
	private readonly _contextEffect = effect(() => {
		const context = this.context();
		if (!this._brnDialog || !context) return;
		this._brnDialog.setContext(context);
	});

	constructor() {
		if (!this._brnDialog) return;
		this._brnDialog.registerTemplate(this._template);
	}
}
