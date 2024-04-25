import { Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { SelectSingleValueTestComponent, SelectSingleValueWithInitialValueTestComponent } from './select-reactive-form';

describe('Brn Select Component in multi-mode', () => {
	const DEFAULT_LABEL = 'Select a Fruit';
	const INITIAL_VALUE_TEXT = 'Apple';
	const INITIAL_VALUE = 'apple';

	const setupWithFormValidation = async () => {
		const { fixture } = await render(SelectSingleValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationAndInitialValue = async () => {
		const { fixture } = await render(SelectSingleValueWithInitialValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const validateFormControlStatus = (el: HTMLElement, statuses: string[]) => {
		statuses.forEach((status) => {
			// Tested this way so test error reveals which class is missing
			const statusExist = el.classList.contains(status) ? status : '';
			expect(statusExist).toBe(status);
		});
	};

	describe('form validation - single mode', () => {
		it('should reflect correct formcontrol status and value with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect correct formcontrol status and value with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance;

			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});

		it('should reflect correct formcontrol status after first user selection with no initial value', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			// Open Select
			await user.click(trigger);
			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			// Select option
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			validateFormControlStatus(trigger, ['ng-touched', 'ng-valid', 'ng-dirty']);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual('banana');
		});

		it('should reflect correct formcontrol status after first user selection with initial value', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as SelectSingleValueWithInitialValueTestComponent;

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			// Open Select
			await user.click(trigger);
			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			// Select option
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			validateFormControlStatus(trigger, ['ng-touched', 'ng-valid', 'ng-dirty']);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual('banana');
		});
	});

	describe('form validation - single mode and required', () => {
		it('should reflect correct formcontrol status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			// Need to fix Sammy
			validateFormControlStatus(trigger, ['ng-untouched', 'ng-invalid', 'ng-pristine']);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect initial single value set on formcontrol', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			validateFormControlStatus(trigger, ['ng-untouched', 'ng-valid', 'ng-pristine']);

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});
	});
});
