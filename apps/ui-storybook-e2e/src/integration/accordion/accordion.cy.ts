describe('accordion', () => {
	const verifyAccordionSetup = () => {
		cy.get('brn-accordion').should('have.attr', 'data-state', 'closed');
		cy.get('brn-accordion-item').should('have.length', 3);
		cy.get('brn-accordion-item').first().as('firstItem');
		cy.get('@firstItem').next().as('secondItem');
		cy.get('@secondItem').next().as('thirdItem');

		cy.get('@firstItem').should('have.attr', 'data-state', 'closed');
		cy.get('@secondItem').should('have.attr', 'data-state', 'closed');
		cy.get('@thirdItem').should('have.attr', 'data-state', 'closed');

		cy.get('@firstItem')
			.find('brn-accordion-trigger')
			.should('have.attr', 'role', 'heading')
			.should('have.id', 'brn-accordion-trigger-0')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get('@firstItem')
			.find('brn-accordion-content')
			.should('have.attr', 'role', 'region')
			.should('have.id', 'brn-accordion-content-0')
			.should('have.attr', 'data-state', 'closed');
	};

	const verifyAccordionStateOpen = () => {
		cy.get('brn-accordion').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionStateClosed = () => {
		cy.get('brn-accordion').should('have.attr', 'data-state', 'closed');
	};

	const verifyAccordionFirstItemStateOpen = () => {
		cy.get('@firstItem').should('have.attr', 'data-state', 'open');
		cy.get('@firstItem')
			.find('brn-accordion-trigger')
			.should('have.attr', 'data-state', 'open')
			.should('have.attr', 'aria-expanded', 'true');
		cy.get('@firstItem').find('brn-accordion-content').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionFirstItemStateClosed = () => {
		cy.get('@firstItem').should('have.attr', 'data-state', 'closed');
		cy.get('@firstItem')
			.find('brn-accordion-trigger')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get('@firstItem').find('brn-accordion-content').should('have.attr', 'data-state', 'closed');
	};

	const verifyAccordionSecondItemStateOpen = () => {
		cy.get('@secondItem').should('have.attr', 'data-state', 'open');
		cy.get('@secondItem')
			.find('brn-accordion-trigger')
			.should('have.attr', 'data-state', 'open')
			.should('have.attr', 'aria-expanded', 'true');
		cy.get('@secondItem').find('brn-accordion-content').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionSecondItemStateClosed = () => {
		cy.get('@secondItem').should('have.attr', 'data-state', 'closed');
		cy.get('@secondItem')
			.find('brn-accordion-trigger')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get('@secondItem').find('brn-accordion-content').should('have.attr', 'data-state', 'closed');
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--default');
			cy.injectAxe();
		});

		it('click on trigger should open and close it content', () => {
			verifyAccordionSetup();

			// click trigger first item to open it content
			cy.get('@firstItem').find('brn-accordion-trigger').click();
			verifyAccordionStateOpen();
			verifyAccordionFirstItemStateOpen();

			// click trigger first item to close it content
			cy.get('@firstItem').find('brn-accordion-trigger').click();
			verifyAccordionStateClosed();
			verifyAccordionFirstItemStateClosed();
		});

		it('click on trigger should open it content and click on another trigger should closed previous content and open newly triggered content', () => {
			verifyAccordionSetup();

			// click trigger first item to open it content
			cy.get('@firstItem').find('brn-accordion-trigger').click();
			verifyAccordionStateOpen();
			verifyAccordionFirstItemStateOpen();

			// click trigger second item to open it content and close previous content
			cy.get('@secondItem').find('brn-accordion-trigger').click();
			verifyAccordionStateOpen();
			verifyAccordionSecondItemStateOpen();
			verifyAccordionFirstItemStateClosed();

			// click trigger second item to close it content
			cy.get('@secondItem').find('brn-accordion-trigger').click();
			verifyAccordionStateClosed();
			verifyAccordionSecondItemStateClosed();
		});
	});
});
