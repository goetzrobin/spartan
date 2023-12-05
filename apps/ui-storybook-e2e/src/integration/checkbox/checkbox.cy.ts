describe('checkbox', () => {
	const verifycheckboxSetup = () => {
		cy.checkA11y('#storybook-root', {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		cy.findByRole('checkbox').should('exist');
		cy.findByRole('checkbox').should('have.attr', 'type', 'checkbox');
		cy.findByRole('checkbox').should('have.id', 'testCheckbox');
	};
	const verifycheckboxOff = () => {
		cy.findByLabelText(/test checkbox/i).should('have.attr', 'value', 'off');
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'unchecked');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'false');
	};
	const verifycheckboxOn = () => {
		cy.findByLabelText(/test checkbox/i).should('have.attr', 'value', 'on');
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'checked');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'true');
	};

	const verifyIndeterminateAttr = () => {
		cy.get('brn-checkbox').should('have.attr', 'data-state', 'indeterminate');
		cy.findByRole('checkbox').should('have.attr', 'aria-checked', 'mixed');
	};

	const executeTabEnterTests = () => {
		verifycheckboxSetup();
		verifycheckboxOff();

		cy.realPress('Tab');
		cy.realPress('Enter');
		verifycheckboxOn();

		cy.realPress('Enter');
		verifycheckboxOff();
	};
	const executeTabSpaceTests = () => {
		verifycheckboxSetup();
		verifycheckboxOff();

		cy.realPress('Tab');
		cy.realPress('Space');
		verifycheckboxOn();

		cy.realPress('Space');
		verifycheckboxOff();
	};
	const executeClickOnLabelTests = () => {
		verifycheckboxSetup();
		verifycheckboxOff();

		cy.findByText(/test checkbox/i).click();
		verifycheckboxOn();

		cy.findByText(/test checkbox/i).click();
		verifycheckboxOff();
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--default');
			cy.injectAxe();
		});

		it('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', () => {
			verifycheckboxSetup();
			verifycheckboxOff();

			cy.get('#checkbox-label').click();
			verifycheckboxOn();

			cy.get('brn-checkbox').click();
			verifycheckboxOff();
		});

		it(
			'[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again',
			executeTabEnterTests,
		);

		it(
			'[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space',
			executeTabSpaceTests,
		);
	});

	describe('inside label', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--inside-label');
			cy.injectAxe();
		});

		it(
			'click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click',
			executeClickOnLabelTests,
		);

		it(
			'[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again',
			// this is the same as label does not change keyboard interaction
			executeTabEnterTests,
		);

		it(
			'[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space',
			// this is the same as label does not change keyboard interaction
			executeTabSpaceTests,
		);
	});

	describe('labeled with aria-labelledby', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--labeled-with-aria-labeled-by');
			cy.injectAxe();
		});

		it(
			'click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click',
			executeClickOnLabelTests,
		);

		it(
			'[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again',
			// this is the same as label does not change keyboard interaction
			executeTabEnterTests,
		);

		it(
			'[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space',
			// this is the same as label does not change keyboard interaction
			executeTabSpaceTests,
		);
	});

	describe('indeterminate', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=checkbox--indeterminate');
			cy.injectAxe();
		});

		it('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', () => {
			// click to get to the default state of unchecked
			verifyIndeterminateAttr();
			cy.findByText(/test checkbox/i).click();
			executeClickOnLabelTests();
		});

		it('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', () => {
			// this is the same as label does not change keyboard interaction
			// click to get to the default state of unchecked
			verifyIndeterminateAttr();
			cy.findByText(/test checkbox/i).click();
			executeTabEnterTests();
		});

		it('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', () => {
			// click to get to the default state of unchecked
			verifyIndeterminateAttr();
			cy.findByText(/test checkbox/i).click();
			executeTabSpaceTests();
		});
	});
});
