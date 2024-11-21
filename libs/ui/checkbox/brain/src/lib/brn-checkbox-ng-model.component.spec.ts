import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnCheckboxComponent } from './brn-checkbox.component';

@Component({
	selector: 'brn-checkbox-ng-model',
	standalone: true,
	template: `
		<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
		<label>
			Airplane mode is: {{ airplaneMode() ? 'on' : 'off' }}
			<brn-checkbox [disabled]="disabled()" [(ngModel)]="airplaneMode"></brn-checkbox>
		</label>
	`,
	imports: [BrnCheckboxComponent, FormsModule],
})
export class BrnCheckboxNgModelSpecComponent {
	public readonly disabled = input(false);

	public readonly airplaneMode = model(false);
}
