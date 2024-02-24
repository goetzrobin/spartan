describe('select', () => {
	const verifySelectSetup = ({ multiple = false, disabled = false, groups = false } = {}) => {
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

		if (!disabled) {
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

			if (groups) {
				// validate groups and labels
				cy.get('hlm-select-group').each(($group, index) => {
					cy.wrap($group).should('have.attr', 'role', 'group');
					cy.wrap($group)
						.find('hlm-select-label')
						.then(($el) => {
							cy.get('hlm-select-group').eq(index).should('have.attr', 'aria-labelledBy', $el.attr('id'));
						});
				});
			}

			// close select
			cy.get('body').click();
			cy.get('[brnselecttrigger]').should('have.focus');
		}
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
			cy.injectAxe();
		});

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
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

		it('should stay open after selecting an option in multi mode', () => {
			cy.visit('/iframe.html?id=select--default&args=multiple:true');
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

	describe('disabled', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--default&args=disabled:true');
			cy.injectAxe();
		});

		it('should not open if disabled', () => {
			verifySelectSetup({ disabled: true });
			cy.get('[brnselecttrigger]').should('be.disabled');
			cy.get('[brnselecttrigger]').click({ force: true });
			cy.get('hlm-select-content').should('not.exist');
		});
	});

	describe('scrollable', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--scrollable');
			cy.injectAxe();
		});

		it('should be scrollable', () => {
			verifySelectSetup({ groups: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-scroll-up').should('not.exist');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll a down from top
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');

			// Scroll to bottom
			cy.get('hlm-select-content').realMouseWheel({ deltaY: 2000 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('not.exist');

			// Scroll back up a bit
			cy.get('hlm-select-content').realMouseWheel({ deltaY: -500 });
			cy.get('hlm-select-scroll-up').should('exist');
			cy.get('hlm-select-scroll-down').should('exist');
		});
	});

	describe('scrollable with sticky headers', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=select--scrollable-with-sticky-labels');
			cy.injectAxe();
		});

		it('should be scrollable with sticky headers', () => {
			verifySelectSetup({ groups: true });
			cy.get('[brnselecttrigger]').click();
			cy.get('hlm-select-content').should('exist');
			cy.get('hlm-select-scroll-up').should('not.exist');
			cy.get('hlm-select-scroll-down').should('exist');

			cy.get('hlm-select-label')
				.eq(0)
				.then(($el) => {
					const elementHeight = $el.height();

					// ensure we scrolled
					cy.get('hlm-select-content').realMouseWheel({ deltaY: elementHeight * 2 });
					cy.get('hlm-select-label').eq(0).should('be.visible');
					cy.get('hlm-select-label').eq(0).should('have.class', 'sticky');
				});
		});
	});
});
