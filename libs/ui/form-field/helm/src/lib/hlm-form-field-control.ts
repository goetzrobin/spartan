import { Directive, Signal, signal } from '@angular/core';
import { AbstractControlDirective, NgControl } from '@angular/forms';

@Directive()
export class HlmFormFieldControl {
	/** Gets the AbstractControlDirective for this control. */
	readonly ngControl: NgControl | AbstractControlDirective | null = null;

	/** Whether the control is in an error state. */
	readonly errorState: Signal<boolean> = signal(false);
}
