import { signal } from "@angular/core";
import type { AbstractControl, FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import type { ErrorStateMatcher } from "./error-options";

export class ErrorStateTracker {
	/** Whether the tracker is currently in an error state. */
	errorState = signal(false);

	/** User-defined matcher for the error state. */
	matcher: ErrorStateMatcher | null = null;

	constructor(
		private _defaultMatcher: ErrorStateMatcher | null,
		public ngControl: NgControl | null,
		private _parentFormGroup: FormGroupDirective | null,
		private _parentForm: NgForm | null,
	) {}

	/** Updates the error state based on the provided error state matcher. */
	updateErrorState() {
		const oldState = this.errorState();
		const parent = this._parentFormGroup || this._parentForm;
		const matcher = this.matcher || this._defaultMatcher;
		const control = this.ngControl ? (this.ngControl.control as AbstractControl) : null;
		const newState = matcher?.isInvalid(control, parent) ?? false;

		if (newState !== oldState) {
			this.errorState.set(newState);
		}
	}
}