import { Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { SelectMultiValueTestComponent, SelectMultiValueWithInitialValueTestComponent } from './select-reactive-form';
import { getFormControlStatus, getFormValidationClasses } from './utils';

describe('Brn Select Component in multi-mode', () => {
	const DEFAULT_LABEL = 'Select a Fruit';

	const setupWithFormValidationMulti = async () => {
		const { fixture } = await render(SelectMultiValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationMultiWithInitialValue = async () => {
		const { fixture } = await render(SelectMultiValueWithInitialValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	describe('form validation - multi mode', () => {
		// should have correct status when initialized with no value and as optional
		it('should reflect correct form control status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance as SelectMultiValueTestComponent;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect correct form control status with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);
		});

		it('should reflect correct form control status and value after first user selection with no initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterClose = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterClose);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterClose);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		it('should reflect correct form control status and value after patching value with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		it('should reflect correct form control status and value after first user selection with initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		it('should reflect correct form control status and value after patching value with initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});
	});

	describe('form validation - multi mode and required', () => {
		/**
		 * No Initial Value
		 */
		it('should reflect correct form control status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: false,
				invalid: true,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		/**
		 * Initial Value
		 */
		// should initialize with correct status and initial value when required
		it('should reflect correct form control status with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);
		});

		/**
		 * User Selection with no initial value
		 */
		it('should reflect correct form control status and value after first user selection with no initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: false,
				invalid: true,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectioneExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectioneExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectioneExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		/**
		 * User Selection with initial value
		 */
		it('should reflect correct form control status and value after first user selection with initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);
		});

		/**
		 * Patch value with no initial value
		 */
		it('should reflect correct form control status and value after patching value with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			// Setting to be required
			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: false,
				invalid: true,
				pristine: true,
				dirty: false,
			};

			// Some issue
			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);
			fixture.detectChanges();

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		/**
		 * Patch value with initial value
		 */
		it('should reflect correct form control status and value after patching value with initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			// Setting to be required
			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});
	});
});
