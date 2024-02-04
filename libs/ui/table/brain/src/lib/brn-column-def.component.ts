import { CdkColumnDef } from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';

@Directive({
	selector: '[brnColumnDef]',
	standalone: true,
	providers: [{ provide: CdkColumnDef, useExisting: BrnColumnDefDirective }],
})
export class BrnColumnDefDirective extends CdkColumnDef {
	/** Unique name for this column. */
	@Input('brnColumnDef')
	override get name(): string {
		return this._name;
	}
	override set name(name: string) {
		this._setNameInput(name);
	}
}
