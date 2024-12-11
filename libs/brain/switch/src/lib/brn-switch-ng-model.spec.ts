import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSwitchThumbComponent } from './brn-switch-thumb.component';
import { BrnSwitchComponent } from './brn-switch.component';

@Component({
	selector: 'brn-switch-ng-model',
	standalone: true,
	template: `
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

describe('BrnSwitchComponentNgModelIntegration', () => {
	const setup = async (airplaneMode = false, disabled = false) => {
		const container = await render(BrnSwitchNgModelSpecComponent, {
			componentInputs: {
				disabled,
				airplaneMode,
			},
		});
		const labelMatch = airplaneMode ? /airplane mode is: on/i : /airplane mode is: off/i;
		return {
			user: userEvent.setup(),
			container,
			switchElement: screen.getByLabelText(labelMatch),
			labelElement: screen.getByText(labelMatch),
		};
	};

	it('click should toggle value correctly', async () => {
		const { labelElement, user, container } = await setup();
		expect(labelElement).toBeInTheDocument();
		await user.click(labelElement);
		await screen.findByDisplayValue('on');
		expect(container.fixture.componentInstance.airplaneMode).toBe(true);
	});

	it('should set input as default correctly and click should toggle then', async () => {
		const { labelElement, user, container } = await setup(true);

		await user.click(labelElement);
		await screen.findByDisplayValue('off');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);

		await user.click(labelElement);
		await screen.findByDisplayValue('on');
		expect(container.fixture.componentInstance.airplaneMode).toBe(true);
	});

	it('should set input as default correctly and enter should toggle then', async () => {
		const { user, container } = await setup(true);

		await user.keyboard('[Tab][Enter]');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);

		await user.keyboard('[Enter]');
		expect(container.fixture.componentInstance.airplaneMode).toBe(true);
	});

	it('should do nothing when disabled', async () => {
		const { labelElement, user, container } = await setup(false, true);

		await user.click(labelElement);
		await screen.findByDisplayValue('off');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);

		await user.click(labelElement);
		await screen.findByDisplayValue('off');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);
	});
});
