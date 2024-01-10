import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSwitchNgModelSpecComponent } from './brn-switch-ng-model.component.spec';

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
		const { labelElement, user, container } = await setup(true);

		await user.click(labelElement);
		await user.keyboard('[Tab][Enter]');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);

		await user.click(labelElement);
		await user.keyboard('[Enter]');
		expect(container.fixture.componentInstance.airplaneMode).toBe(true);
	});

	// TODO - why does this test not fail? it should be setup(false, true) but setup(false, false) still passes
	it('should do nothing when disabled', async () => {
		const { labelElement, user, container } = await setup(false, false);

		// TODO - using fireEvent.click here causes the test to fail, not sure why.
		await user.click(labelElement);
		await screen.findByDisplayValue('off');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);

		await user.click(labelElement);
		await screen.findByDisplayValue('off');
		expect(container.fixture.componentInstance.airplaneMode).toBe(false);
	});
});
