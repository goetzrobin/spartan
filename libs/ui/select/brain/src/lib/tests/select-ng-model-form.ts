import { Component, signal } from '@angular/core';

@Component({
	selector: 'select-ngmodel-form',
	template: `
		<form ngForm>
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit() | json }}</pre>
			</div>
			<hlm-select class="w-56" [(ngModel)]="fruit" name="fruit">
				<label hlmLabel>Select an option</label>
				<hlm-select-trigger>
					<brn-select-value data-testid="brn-select-value" hlm />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-select-label>Fruits</hlm-select-label>
					<hlm-option value="apple">Apple</hlm-option>
					<hlm-option value="banana">Banana</hlm-option>
					<hlm-option value="blueberry">Blueberry</hlm-option>
					<hlm-option value="grapes">Grapes</hlm-option>
					<hlm-option value="pineapple">Pineapple</hlm-option>
				</hlm-select-content>
			</hlm-select>
		</form>
	`,
})
export class SelectNgModelComponent {
	fruit = signal('');
}
