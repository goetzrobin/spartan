import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TemplateDrivenFormSliderComponent } from './brn-slider-states.component';

async function setupSlider() {
	const { fixture } = await render(TemplateDrivenFormSliderComponent);

	return {
		fixture,
		slider: screen.getByRole('slider'),
		input: screen.getByTestId('input'),
		changeValueBtn: screen.getByTestId('change-value-btn'),
		valueIndicatorPre: screen.getByTestId('value-indicator-pre'),
	};
}

async function setupSliderWithInitialValue(initialValue: number) {
	const { fixture } = await render(TemplateDrivenFormSliderComponent, {
		componentInputs: { temperature: initialValue },
	});

	return {
		fixture,
		slider: screen.getByRole('slider'),
		input: screen.getByTestId('input'),
		changeValueBtn: screen.getByTestId('change-value-btn'),
		valueIndicatorPre: screen.getByTestId('value-indicator-pre'),
	};
}

describe('Template Driven Form Slider State', () => {
	describe('Default Initial Value', () => {
		it('Should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
			const { input, slider, valueIndicatorPre } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('0');
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

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('0');
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

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('0');
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
			const { fixture, slider, input, changeValueBtn, valueIndicatorPre } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('0');
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

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('24');
			expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});
	});

	describe('With Initial Value', () => {
		it('Should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
			const { fixture, input, slider, valueIndicatorPre } = await setupSliderWithInitialValue(12);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 12');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('12');
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
			const { fixture, slider, input, valueIndicatorPre } = await setupSliderWithInitialValue(67);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 67');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('67');
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
			const { fixture, slider, input, valueIndicatorPre } = await setupSliderWithInitialValue(34);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 34');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('34');
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
			const { fixture, slider, input, changeValueBtn, valueIndicatorPre } = await setupSliderWithInitialValue(88);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 88');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('88');
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

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
			expect(input.getAttribute('aria-valuenow')?.trim()).toBe('24');
			expect(input.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(input.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});
	});
});
