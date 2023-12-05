import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnCheckboxComponent } from './brn-checkbox.component';

@Component({
	selector: 'brn-checkbox-ng-model',
	standalone: true,
	template: `
		<label>
			Airplane mode is: {{ airplaneMode ? 'on' : 'off' }}
			<brn-checkbox [disabled]="disabled" [(ngModel)]="airplaneMode"></brn-checkbox>
		</label>
	`,
	imports: [BrnCheckboxComponent, FormsModule],
})
export class BrnCheckboxNgModelSpecComponent {
	@Input()
	public disabled = false;
	@Input()
	public airplaneMode = false;
}
