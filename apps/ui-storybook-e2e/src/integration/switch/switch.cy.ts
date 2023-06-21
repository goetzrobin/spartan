describe('switch', () => {
  const verifySwitchSetup = () => {
    cy.checkA11y(null, {
      rules: {
        'page-has-heading-one': { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    });
    cy.findByRole('switch').should('exist');
    cy.findByRole('switch').should('have.attr', 'type', 'checkbox');
    cy.findByRole('switch').should('have.id', 'testSwitch');
  };
  const verifySwitchOff = () => {
    cy.findByRole('switch').should('have.attr', 'value', 'off');
    cy.get('brn-switch').should('have.attr', 'data-state', 'unchecked');
  };
  const verifySwitchOn = () => {
    cy.findByLabelText('test switch').should('have.attr', 'value', 'on');
    cy.get('brn-switch').should('have.attr', 'data-state', 'checked');
  };

  describe('default', () => {
    beforeEach(() => {
      cy.visit('/iframe.html?id=switch--default');
      cy.injectAxe();
    });

    it('click interactions should render as unchecked, become checked on thumb click, become unchecked on switch click', () => {
      verifySwitchSetup();
      verifySwitchOff();

      cy.get('brn-switch-thumb').click();
      verifySwitchOn();

      cy.get('brn-switch').click();
      verifySwitchOff();
    });

    it('[Tab][Enter] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click', () => {
      verifySwitchSetup();
      verifySwitchOff();

      cy.realPress('Tab');
      cy.realPress('Enter');
      verifySwitchOn();

      cy.realPress('Enter');
      verifySwitchOff();
    });

    it('[Tab][Space] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click', () => {
      verifySwitchSetup();
      verifySwitchOff();

      cy.realPress('Tab');
      cy.realPress('Space');
      verifySwitchOn();

      cy.realPress('Space');
      verifySwitchOff();
    });
  });
});
