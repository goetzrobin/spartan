import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmSwitchComponent } from './hlm-switch.component';
@Component({
	selector: 'hlm-switch-ng-model',
	standalone: true,
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch [(ngModel)]="switchValue" id="testSwitchForm" aria-label="test switch" />
		</label>
		<p data-testid="switchValue">
			{{ switchValue }}
		</p>
	`,
	imports: [HlmSwitchComponent, FormsModule],
})
export class SwitchFormComponent {
	@Input()
	public switchValue = false;
}
