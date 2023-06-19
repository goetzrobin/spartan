import { render, screen } from '@testing-library/angular';
import { BrnSwitchComponent } from './brn-switch.component';
import { BrnSwitchThumbComponent } from './brn-switch-thumb.component';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

describe('BrnSwitchComponent', () => {
  const setup = async () => {
    const container = await render(
      `
     <brn-switch id='switchId' name='switchName' data-testid='switch' aria-label='switch'>
             <brn-switch-thumb />
      </brn-switch>
    `,
      {
        imports: [BrnSwitchComponent, BrnSwitchThumbComponent],
      }
    );
    return {
      user: userEvent.setup(),
      container,
      switchElement: screen.getByLabelText('switch'),
    };
  };

  const setupInsideLabel = async () => {
    const container = await render(
      `
     <label>
     Switch Inside Label
     <brn-switch id='switchId' data-testid='switch' name='switchName'>
             <brn-switch-thumb />
      </brn-switch>
      </label>
    `,
      {
        imports: [BrnSwitchComponent, BrnSwitchThumbComponent],
      }
    );
    return {
      user: userEvent.setup(),
      container,
      switchElement: screen.getByLabelText(/switch inside label/i),
      labelElement: screen.getByText(/switch inside label/i),
    };
  };

  const setupOutsideLabelWithAriaLabelledBy = async () => {
    const container = await render(
      `
     <!-- need for because arialabelledby only provides accessible name -->
     <label id='labelId' for='switchId'>
     Switch Outside Label with ariaLabelledBy
     </label>
     <brn-switch id='switchId' name='switchName' data-testid='switch' aria-labelledby='labelId'>
             <brn-switch-thumb />
      </brn-switch>
    `,
      {
        imports: [BrnSwitchComponent, BrnSwitchThumbComponent],
      }
    );
    return {
      user: userEvent.setup(),
      container,
      switchElement: screen.getByLabelText(/switch outside label with arialabelledby/i),
      labelElement: screen.getByText(/switch outside label with arialabelledby/i),
    };
  };

  const setupOutsideLabelWithForAndId = async () => {
    const container = await render(
      `
     <label for='switchId'>
     Switch Outside Label with id
     </label>
     <brn-switch id='switchId' name='switchName' data-testid='switch'>
             <brn-switch-thumb />
      </brn-switch>
    `,
      {
        imports: [BrnSwitchComponent, BrnSwitchThumbComponent],
      }
    );
    return {
      user: userEvent.setup(),
      container,
      switchElement: screen.getByLabelText(/switch outside label with id/i),
      labelElement: screen.getByText(/switch outside label with id/i),
    };
  };

  type Options = Partial<{ focus: boolean; focusVisible: boolean; disabled: boolean }>;

  const validateAttributes = async (
    inputElement: HTMLElement,
    switchElement: HTMLElement,
    shouldBeChecked: boolean,
    opts?: Options
  ) => {
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('role', 'switch');
    expect(inputElement).toHaveAttribute('id', 'switchId');
    expect(inputElement).toHaveAttribute('name', 'switchName');
    expect(await axe(inputElement)).toHaveNoViolations();

    expect(switchElement).toHaveAttribute('id', 'switchId-switch');
    expect(switchElement).toHaveAttribute('name', 'switchName-switch');
    expect(switchElement).toHaveAttribute('data-state', shouldBeChecked ? 'checked' : 'unchecked');
    expect(switchElement).toHaveAttribute('data-disabled', `${!!opts?.disabled}`);
    expect(switchElement).toHaveAttribute('data-focus', `${!!opts?.focus}`);
    expect(switchElement).toHaveAttribute('data-focus-visible', `${!!opts?.focusVisible}`);
    expect(await axe(switchElement)).toHaveNoViolations();
  };
  const validateSwitchOn = async (opts?: Options) => {
    const inputElement = await screen.findByDisplayValue('on');
    const switchElement = await screen.findByTestId('switch');

    await validateAttributes(inputElement, switchElement, true, opts);
  };
  const validateSwitchOff = async (opts?: Options) => {
    const inputElement = await screen.findByDisplayValue('off');
    const switchElement = await screen.findByTestId('switch');

    await validateAttributes(inputElement, switchElement, false, opts);
  };

  describe('with aria-label', () => {
    it('unchecked by default', async () => {
      await setup();
      await validateSwitchOff();
    });
    it('mouse click on element toggles', async () => {
      const { user, switchElement } = await setup();
      await validateSwitchOff();
      await user.click(switchElement);
      await validateSwitchOn({ focus: true });
      await user.click(switchElement);
      await validateSwitchOff({ focus: true });
    });
    it('focus with tab and enter toggles', async () => {
      const { user } = await setup();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Enter]');
      await validateSwitchOn(options);
      await user.keyboard('[Enter]');
      await validateSwitchOff(options);
      await user.keyboard('[Enter]');
      await validateSwitchOn(options);
    });
    it('focus with tab and space toggles', async () => {
      const { user } = await setup();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Space]');
      await validateSwitchOn(options);
      await user.keyboard('[Space]');
      await validateSwitchOff(options);
      await user.keyboard('[Space]');
      await validateSwitchOn(options);
    });
  });

  describe('inside <label>', () => {
    it('unchecked by default', async () => {
      await setupInsideLabel();
      await validateSwitchOff();
    });
    it('mouse click on element toggles', async () => {
      const { user, labelElement } = await setupInsideLabel();
      await validateSwitchOff();
      await user.click(labelElement);
      await validateSwitchOn({ focus: true });
      await user.click(labelElement);
      await validateSwitchOff({ focus: true });
    });
    it('focus with tab and enter toggles', async () => {
      const { user } = await setupInsideLabel();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Enter]');
      await validateSwitchOn(options);
      await user.keyboard('[Enter]');
      await validateSwitchOff(options);
      await user.keyboard('[Enter]');
      await validateSwitchOn(options);
    });
    it('focus with tab and space toggles', async () => {
      const { user } = await setupInsideLabel();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Space]');
      await validateSwitchOn(options);
      await user.keyboard('[Space]');
      await validateSwitchOff(options);
      await user.keyboard('[Space]');
      await validateSwitchOn(options);
    });
  });

  describe('outside <label> with aria-labelledby', () => {
    it('unchecked by default', async () => {
      await setupOutsideLabelWithAriaLabelledBy();
      await validateSwitchOff();
    });
    it('mouse click on element toggles', async () => {
      const { user, labelElement } = await setupOutsideLabelWithAriaLabelledBy();
      await validateSwitchOff();
      await user.click(labelElement);
      await validateSwitchOn({ focus: true });
      await user.click(labelElement);
      await validateSwitchOff({ focus: true });
    });
    it('focus with tab and enter toggles', async () => {
      const { user } = await setupOutsideLabelWithAriaLabelledBy();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Enter]');
      await validateSwitchOn(options);
      await user.keyboard('[Enter]');
      await validateSwitchOff(options);
      await user.keyboard('[Enter]');
      await validateSwitchOn(options);
    });
    it('focus with tab and space toggles', async () => {
      const { user } = await setupOutsideLabelWithAriaLabelledBy();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Space]');
      await validateSwitchOn(options);
      await user.keyboard('[Space]');
      await validateSwitchOff(options);
      await user.keyboard('[Space]');
      await validateSwitchOn(options);
    });
  });

  describe('outside <label> with for and id', () => {
    it('unchecked by default', async () => {
      await setupOutsideLabelWithForAndId();
      await validateSwitchOff();
    });
    it('mouse click on element toggles', async () => {
      const { user, labelElement } = await setupOutsideLabelWithForAndId();
      await validateSwitchOff();
      await user.click(labelElement);
      await validateSwitchOn({ focus: true });
      await user.click(labelElement);
      await validateSwitchOff({ focus: true });
    });
    it('focus with tab and enter toggles', async () => {
      const { user } = await setupOutsideLabelWithForAndId();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Enter]');
      await validateSwitchOn(options);
      await user.keyboard('[Enter]');
      await validateSwitchOff(options);
      await user.keyboard('[Enter]');
      await validateSwitchOn(options);
    });
    it('focus with tab and space toggles', async () => {
      const { user } = await setupOutsideLabelWithForAndId();
      const options = { focus: true, focusVisible: true };
      await validateSwitchOff();
      await user.keyboard('[Tab][Space]');
      await validateSwitchOn(options);
      await user.keyboard('[Space]');
      await validateSwitchOff(options);
      await user.keyboard('[Space]');
      await validateSwitchOn(options);
    });
  });
});
