describe('switch', () => {
  const verifySwitchSetup = () => {
    cy.checkA11y('#storybook-root', {
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
    cy.findByLabelText(/test switch/i).should('have.attr', 'value', 'off');
    cy.get('brn-switch').should('have.attr', 'data-state', 'unchecked');
  };
  const verifySwitchOn = () => {
    cy.findByLabelText(/test switch/i).should('have.attr', 'value', 'on');
    cy.get('brn-switch').should('have.attr', 'data-state', 'checked');
  };

  const executeTabEnterTests = () => {
    verifySwitchSetup();
    verifySwitchOff();

    cy.realPress('Tab');
    cy.realPress('Enter');
    verifySwitchOn();

    cy.realPress('Enter');
    verifySwitchOff();
  };
  const executeTabSpaceTests = () => {
    verifySwitchSetup();
    verifySwitchOff();

    cy.realPress('Tab');
    cy.realPress('Space');
    verifySwitchOn();

    cy.realPress('Space');
    verifySwitchOff();
  };
  const executeClickOnLabelTests = () => {
    verifySwitchSetup();
    verifySwitchOff();

    cy.findByText(/test switch/i).click();
    verifySwitchOn();

    cy.findByText(/test switch/i).click();
    verifySwitchOff();
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

    it(
      '[Tab][Enter] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      executeTabEnterTests
    );

    it(
      '[Tab][Space] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      executeTabSpaceTests
    );
  });

  describe('inside label', () => {
    beforeEach(() => {
      cy.visit('/iframe.html?id=switch--inside-label');
      cy.injectAxe();
    });

    it(
      'click interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      executeClickOnLabelTests
    );

    it(
      '[Tab][Enter] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      // this is the same as label does not change keyboard interaction
      executeTabEnterTests
    );

    it(
      '[Tab][Space] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      // this is the same as label does not change keyboard interaction
      executeTabSpaceTests
    );
  });

  describe('labeled with aria-labelledby', () => {
    beforeEach(() => {
      cy.visit('/iframe.html?id=switch--labeled-with-aria-labeled-by');
      cy.injectAxe();
    });

    it(
      'click interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      executeClickOnLabelTests
    );

    it(
      '[Tab][Enter] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      // this is the same as label does not change keyboard interaction
      executeTabEnterTests
    );

    it(
      '[Tab][Space] interactions should render as unchecked, become checked on thumb click, become unchecked on switch click',
      // this is the same as label does not change keyboard interaction
      executeTabSpaceTests
    );
  });
});
