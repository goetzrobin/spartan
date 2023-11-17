import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CustomElementClassSettable, provideCustomClassSettableExisting } from '@spartan-ng/ui-core';
import { BrnDialogComponent } from './brn-dialog.component';

@Component({
	selector: 'brn-dialog-overlay',
	standalone: true,
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlayComponent)],
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnDialogOverlayComponent implements CustomElementClassSettable {
	private _brnDialog = inject(BrnDialogComponent);
	@Input()
	set class(newClass: string | null | undefined) {
		this._brnDialog.setOverlayClass(newClass);
	}
	setClassToCustomElement(newClass: string) {
		this._brnDialog.setOverlayClass(newClass);
	}
}
