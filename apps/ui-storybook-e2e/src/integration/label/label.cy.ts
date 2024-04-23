describe('label', () => {
	describe('default', () => {
		beforeEach(() => {
			cy.visit('/iframe.html?id=label--default');
			cy.injectAxe();
		});

		it('should have an id autogenerated if none provided', () => {
			cy.get('[hlmLabel]').as('label');
			cy.get('@label').should('have.attr', 'id', 'brn-label-0');
		});

		it('should override default id if one is defined', () => {
			cy.visit('/iframe.html?id=label--default&args=id:my-id');

			cy.get('[hlmLabel]').as('label');
			cy.get('@label').should('have.attr', 'id', 'my-id');
		});
	});
});
