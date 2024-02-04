import { CdkColumnDef } from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';

@Directive({
	selector: '[hlmColumnDef]',
	standalone: true,
	providers: [{ provide: CdkColumnDef, useExisting: HlmColumnDefDirective }],
})
export class HlmColumnDefDirective extends CdkColumnDef {
	/** Unique name for this column. */
	@Input('hlmColumnDef')
	override get name(): string {
		return this._name;
	}
	override set name(name: string) {
		this._setNameInput(name);
	}
}
