import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/ui-core';
import { HlmErrorDirective } from '../directives/hlm-error.directive';
import { HlmHintDirective } from '../directives/hlm-hint.directive';
import { HlmFormFieldComponent } from '../hlm-form-field.component';

const DIRECTIVES = [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective, HlmInputDirective];

@Component({
	standalone: true,
	selector: 'single-form-field-example',
	imports: [ReactiveFormsModule, ...DIRECTIVES],
	template: `
		<hlm-form-field>
			<input
				data-testid="hlm-input"
				aria-label="Your Name"
				[formControl]="name"
				class="w-80"
				hlmInput
				type="text"
				placeholder="Your Name"
			/>
			<hlm-error data-testid="hlm-error">Your name is required</hlm-error>
			<hlm-hint data-testid="hlm-hint">This is your public display name.</hlm-hint>
		</hlm-form-field>
	`,
})
export class SingleFormField {
	name = new FormControl('', Validators.required);
}

@Component({
	standalone: true,
	selector: 'single-form-field-dirty-example',
	imports: [ReactiveFormsModule, ...DIRECTIVES],
	template: `
		<hlm-form-field>
			<input
				data-testid="hlm-input"
				aria-label="Your Name"
				[formControl]="name"
				class="w-80"
				hlmInput
				type="text"
				placeholder="Your Name"
			/>
			<hlm-error data-testid="hlm-error">Your name is required</hlm-error>
			<hlm-hint data-testid="hlm-hint">This is your public display name.</hlm-hint>
		</hlm-form-field>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class SingleFormFieldDirty {
	name = new FormControl('', Validators.required);
}
