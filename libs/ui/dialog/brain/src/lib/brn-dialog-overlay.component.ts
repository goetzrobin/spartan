import { ChangeDetectionStrategy, Component, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/ui-core';
import { BrnDialogComponent } from './brn-dialog.component';

@Component({
	selector: 'brn-dialog-overlay',
	standalone: true,
	template: '',
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlayComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnDialogOverlayComponent {
	private readonly _brnDialog = inject(BrnDialogComponent);

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	private readonly _classEffect = effect(() => {
		if (!this._brnDialog) return;
		const newClass = this.className();
		this._brnDialog.setOverlayClass(newClass);
	});

	setClassToCustomElement(newClass: string) {
		this._brnDialog.setOverlayClass(newClass);
	}
}
