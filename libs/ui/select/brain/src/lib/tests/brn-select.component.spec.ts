import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSelectImports } from '../../index';
import { SelectMultiValueTestComponent, SelectSingleValueTestComponent } from './select-reactive-form';

describe('BrnSelectComponent', () => {
	const setup = async () => {
		const openChangeSpy = jest.fn();
		const container = await render(
			`
            <brn-select class="inline-block" [multiple]="multiple" (openedChange)="openedChange($event)">
			<button brnSelectTrigger class='w-56' data-testid="brn-select-trigger">
				<brn-select-value />
			</button>
			<brn-select-content class="w-56" data-testid="brn-select-content">
				<label brnSelectLabel>Fruits</label>
				<div brnOption value="apple">Apple</div>
				<div brnOption value="banana">Banana</div>
				<div brnOption value="blueberry">Blueberry</div>
				<div brnOption value="grapes">Grapes</div>
				<div brnOption value="pineapple">Pineapple</div>
		  </brn-select-content>
		</brn-select>
    `,
			{
				imports: [...BrnSelectImports],
				componentProperties: {
					multiple: true,
					openedChange: openChangeSpy,
				},
			},
		);
		return {
			user: userEvent.setup(),
			container,
			trigger: screen.getByTestId('brn-select-trigger'),
			openChangeSpy,
		};
	};

	const setupWithFormValidation = async () => {
		const { fixture } = await render(SelectSingleValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationMulti = async () => {
		const { fixture } = await render(SelectMultiValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	describe('default', () => {
		it('openChanged should emit event on open and close', async () => {
			const { user, trigger, openChangeSpy } = await setup();
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(1);
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(2);
		});
	});

	describe('form validation', () => {
		it('should reflect initial single value set on formcontrol', async () => {
			const { fixture, value } = await setupWithFormValidation();

			expect(value.textContent?.trim()).toBe('Apple');
			expect((fixture.componentInstance as SelectSingleValueTestComponent).form?.get('fruit')?.value).toEqual('apple');
		});

		it('should reflect initial single value set on formcontrol and update with next option', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidation();

			expect(value.textContent?.trim()).toBe('Apple');
			expect((fixture.componentInstance as SelectSingleValueTestComponent).form?.get('fruit')?.value).toEqual('apple');

			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			expect((fixture.componentInstance as SelectSingleValueTestComponent).form?.get('fruit')?.value).toEqual('banana');
		});

		it('should reflect initial multi value set on formcontrol', async () => {
			const { fixture, value } = await setupWithFormValidationMulti();

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect((fixture.componentInstance as SelectMultiValueTestComponent).form?.get('fruit')?.value).toEqual([
				'apple',
				'blueberry',
			]);
		});

		it('should reflect initial multi value set on formcontrol and update with next option including previous', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidationMulti();

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect((fixture.componentInstance as SelectMultiValueTestComponent).form?.get('fruit')?.value).toEqual([
				'apple',
				'blueberry',
			]);

			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			expect((fixture.componentInstance as SelectSingleValueTestComponent).form?.get('fruit')?.value).toEqual([
				'apple',
				'banana',
				'blueberry',
			]);
		});
	});

	describe('multiple option select', () => {
		it('when multiple true -> false with multiple selected values, should reset', async () => {
			const { user, trigger, container } = await setup();
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			await user.click(options[1]);
			expect(trigger.textContent).toContain(`${options[0].textContent}, ${options[1].textContent}`);
			container.rerender({
				componentProperties: {
					multiple: false,
				},
			});
			expect(trigger.textContent).toContain('');
		});

		it('when multiple true -> false with single value, should retain value', async () => {
			const { user, trigger, container } = await setup();
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			expect(trigger.textContent).toContain(`${options[0].textContent}`);
			container.rerender({
				componentProperties: {
					multiple: false,
				},
			});
			expect(trigger.textContent).toContain(`${options[0].textContent}`);
		});
	});
});
