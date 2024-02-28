import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSelectImports } from '../index';

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

	describe('default', () => {
		it('openChanged should emit event on open and close', async () => {
			const { user, trigger, openChangeSpy } = await setup();
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(1);
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(2);
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
