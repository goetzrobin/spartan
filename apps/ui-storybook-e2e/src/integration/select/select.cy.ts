describe('select', () => {
	const verifySelectSetup = ({ multiple = false } = {}) => {
		const labelId = 'brn-select-0--label';
		const triggerId = 'brn-select-0--trigger';
		const listboxtId = 'brn-select-0--content';
		const valueId = 'brn-select-0--value';

		// label
		cy.get('hlm-select').find('label').should('not.be.visible').should('have.id', labelId);

		// Trigger
		cy.get('[brnselecttrigger]').should('have.id', triggerId);
		cy.get('[brnselecttrigger]').should('have.attr', 'role', 'combobox');
		cy.get('[brnselecttrigger]').should('have.attr', 'aria-autocomplete', 'none');
		cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');

		// Value
		cy.get('hlm-select-value').should('have.id', valueId);

		// Open select
		cy.get('[brnselecttrigger]').click();

		cy.get('hlm-select-content').should('have.id', listboxtId);

		// Listbox
		cy.get('hlm-select-content').should('have.attr', 'role', 'listbox');
		cy.get('hlm-select-content').should('have.attr', 'aria-disabled', 'false');
		cy.get('hlm-select-content').should('have.attr', 'aria-multiselectable', `${multiple}`);
		cy.get('hlm-select-content').should('have.attr', 'aria-orientation', 'vertical');
		cy.get('hlm-select-content').should('have.attr', 'aria-labelledby', labelId);
		cy.get('hlm-select-content').should('have.attr', 'aria-controlledby', triggerId);

		// Select Label
		// cy.get('hlm-select-content').find('hlm-select-label')[0].should('have.id', 'brn-label-0');

		// Option
		cy.get('hlm-option').should('have.attr', 'role', 'option');
		cy.get('hlm-option').should('have.attr', 'aria-selected', 'false');
		cy.get('hlm-option').should('have.attr', 'aria-disabled', 'false');
		// cy.get('hlm-option').should('not.have.value', '');
		cy.get('hlm-option').should(($el) => {
			expect($el[0].id).to.match(/cdk-option/);
		});

		// close select
		cy.get('body').click();
	};

	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default');
			cy.injectAxe();
		});

		it('click on trigger should open and close it content', () => {
			verifySelectSetup();
			cy.get('[brnselecttrigger]').click();
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'true');
			cy.get('body').click();
			cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
		});

		it('should close after selecting an option in single mode', () => {
			verifySelectSetup();
			cy.get('[brnselecttrigger]').click();

			cy.get('hlm-option')
				.eq(0)
				.then(($el) => {
					const optionValue = $el.attr('value');
					cy.get('hlm-option').eq(0).click();
					cy.get('hlm-select-content').should('not.exist');
					cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
					cy.get('hlm-select-value').contains(optionValue, { matchCase: false });
				});
		});
	});

	describe('multiple', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
			cy.injectAxe();
		});

		it('should stay open after selecting an option in multi mode', () => {
			verifySelectSetup({ multiple: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option').eq(0).click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-option')
				.eq(0)
				.then(($el) => {
					const optionValue = $el.attr('value');
					cy.get('hlm-option').eq(1).click();
					cy.get('hlm-option')
						.eq(1)
						.then(($el2) => {
							const optionValue2 = $el2.attr('value');
							cy.get('hlm-select-value').contains(optionValue, { matchCase: false });
							cy.get('hlm-select-value').contains(optionValue2, { matchCase: false });

							cy.get('body').click();
							cy.get('hlm-select-content').should('not.exist');
							cy.get('[brnselecttrigger]').should('have.attr', 'aria-expanded', 'false');
						});
				});
		});
	});
});
