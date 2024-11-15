import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSwitchThumbComponent } from './brn-switch-thumb.component';
import { BrnSwitchComponent } from './brn-switch.component';

@Component({
	selector: 'brn-switch-ng-model',
	standalone: true,
	template: `
		<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
		<label>
			Airplane mode is: {{ airplaneMode ? 'on' : 'off' }}
			<brn-switch [disabled]="disabled" [(ngModel)]="airplaneMode">
				<brn-switch-thumb />
			</brn-switch>
		</label>
	`,
	imports: [BrnSwitchComponent, BrnSwitchThumbComponent, FormsModule],
})
export class BrnSwitchNgModelSpecComponent {
	@Input()
	public disabled = false;
	@Input()
	public airplaneMode = false;
}
