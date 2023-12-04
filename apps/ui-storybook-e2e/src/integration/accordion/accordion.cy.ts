describe('accordion', () => {
	const verifyAccordionSetup = () => {
		cy.get('[hlmaccordion]').should('have.attr', 'data-state', 'closed');
		cy.get('[hlmAccordionItem]').should('have.length', 3);
		cy.get('[hlmAccordionItem]').first().as('firstItem');
		cy.get('@firstItem').next().as('secondItem');
		cy.get('@secondItem').next().as('thirdItem');

		cy.get('@firstItem').should('have.attr', 'data-state', 'closed');
		cy.get('@secondItem').should('have.attr', 'data-state', 'closed');
		cy.get('@thirdItem').should('have.attr', 'data-state', 'closed');

		cy.get('@firstItem')
			.find('[hlmAccordionTrigger]')
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
	const verifyTwoAccordionSetup = () => {
		cy.get('[hlmaccordion]').should('have.attr', 'data-state', 'closed').as('accordion1');
		cy.get('[hlmAccordionItem]').should('have.length', 7);
		cy.get('[hlmAccordionItem]').first().as('item1.1');
		cy.get('@item1.1').next().as('item1.2');
		cy.get('@item1.2').next().as('item1.3');
		cy.get('[hlmaccordion]').last().should('have.attr', 'data-state', 'closed').as('accordion2');

		cy.get('@accordion2').children().first().as('item2.1');
		cy.get('@item2.1').next().as('item2.2');
		cy.get('@item2.2').next().as('item2.3');
		cy.get('@item2.3').next().as('item2.4');

		cy.get('@item1.1').should('have.attr', 'data-state', 'closed');
		cy.get('@item1.2').should('have.attr', 'data-state', 'closed');
		cy.get('@item1.3').should('have.attr', 'data-state', 'closed');
		cy.get('@item2.1').should('have.attr', 'data-state', 'closed');
		cy.get('@item2.2').should('have.attr', 'data-state', 'closed');
		cy.get('@item2.3').should('have.attr', 'data-state', 'closed');
		cy.get('@item2.4').should('have.attr', 'data-state', 'closed');

		cy.get('@item1.1')
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'role', 'heading')
			.should('have.id', 'brn-accordion-trigger-0')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get('@item2.4')
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'role', 'heading')
			.should('have.id', 'brn-accordion-trigger-6')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
	};

	const verifyAccordionStateOpen = () => {
		cy.get('[hlmaccordion]').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionStateClosed = () => {
		cy.get('[hlmaccordion]').should('have.attr', 'data-state', 'closed');
	};

	const verifyAccordionFirstItemStateOpen = () => {
		cy.get('@firstItem').should('have.attr', 'data-state', 'open');
		cy.get('@firstItem')
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'data-state', 'open')
			.should('have.attr', 'aria-expanded', 'true');
		cy.get('@firstItem').find('brn-accordion-content').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionFirstItemStateClosed = () => {
		cy.get('@firstItem').should('have.attr', 'data-state', 'closed');
		cy.get('@firstItem')
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'data-state', 'closed')
			.should('have.attr', 'aria-expanded', 'false');
		cy.get('@firstItem').find('brn-accordion-content').should('have.attr', 'data-state', 'closed');
	};

	const verifyAccordionSecondItemStateOpen = () => {
		cy.get('@secondItem').should('have.attr', 'data-state', 'open');
		cy.get('@secondItem')
			.find('[hlmAccordionTrigger]')
			.should('have.attr', 'data-state', 'open')
			.should('have.attr', 'aria-expanded', 'true');
		cy.get('@secondItem').find('brn-accordion-content').should('have.attr', 'data-state', 'open');
	};

	const verifyAccordionSecondItemStateClosed = () => {
		cy.get('@secondItem').should('have.attr', 'data-state', 'closed');
		cy.get('@secondItem')
			.find('[hlmAccordionTrigger]')
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
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateOpen();
			verifyAccordionFirstItemStateOpen();

			// click trigger first item to close it content
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateClosed();
			verifyAccordionFirstItemStateClosed();
		});

		it('click on trigger should open it content and click on another trigger should closed previous content and open newly triggered content', () => {
			verifyAccordionSetup();

			// click trigger first item to open it content
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateOpen();
			verifyAccordionFirstItemStateOpen();

			// click trigger second item to open it content and close previous content
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateOpen();
			verifyAccordionSecondItemStateOpen();
			verifyAccordionFirstItemStateClosed();

			// click trigger second item to close it content
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateClosed();
			verifyAccordionSecondItemStateClosed();
		});
		it('click on trigger should open it content and click on another trigger should closed previous content and open newly triggered content', () => {
			verifyAccordionSetup();

			// click trigger first item to open it content
			cy.get('@firstItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateOpen();
			verifyAccordionFirstItemStateOpen();

			// click trigger second item to open it content and close previous content
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateOpen();
			verifyAccordionSecondItemStateOpen();
			verifyAccordionFirstItemStateClosed();

			// click trigger second item to close it content
			cy.get('@secondItem').find('[hlmAccordionTrigger]').click();
			verifyAccordionStateClosed();
			verifyAccordionSecondItemStateClosed();
		});
	});
	describe('Two accordions', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=accordion--two-accordions');
			cy.injectAxe();
		});

		it('should focus the correct items when using arrow down', () => {
			verifyTwoAccordionSetup();
			cy.get('@item1.1').find('[hlmAccordionTrigger]').click();
			cy.get('@item1.1').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-1');
			cy.get('@item1.2').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-2');
			cy.get('@item1.3').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-0');

			cy.get('@item1.2').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-2');
			cy.get('@item2.1').find('[hlmAccordionTrigger]').click();
			cy.get('@item2.1').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-4');
			cy.get('@item2.2').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-5');
			cy.get('@item2.3').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-6');
			cy.get('@item2.4').type(`{downArrow}`);
			cy.focused().should('have.attr', 'id', 'brn-accordion-trigger-3');
		});
	});
});
