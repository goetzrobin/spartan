import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormSliderComponent } from './brn-slider-states.component';

async function setupSlider() {
	await render(ReactiveFormSliderComponent);

	return {
		slider: screen.getByRole('slider'),
		input: screen.getByTestId('input'),
		changeValueBtn: screen.getByTestId('change-value-btn'),
		valueIndicatorPre: screen.getByTestId('value-indicator-pre'),
	};
}

describe('Reactive Form Slider State', () => {
	it('Should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
		const { input, slider, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fireEvent.change(slider, { target: { value: '25' } });

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('25');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when selecting a value below min', async () => {
		const { slider, input, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fireEvent.change(slider, { target: { value: '-25' } });

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when selecting a value after max', async () => {
		const { slider, input, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fireEvent.change(slider, { target: { value: '225' } });

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('100');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when changing the slider value', async () => {
		const { slider, input, changeValueBtn, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fireEvent.change(slider, { target: { value: '225' } });

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('100');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//change slider value using a button
		await userEvent.click(changeValueBtn);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
		expect(input.getAttribute('aria-valuenow')?.trim()).toBe('24');
		expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});
});
