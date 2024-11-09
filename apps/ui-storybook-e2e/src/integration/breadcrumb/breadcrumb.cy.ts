describe('Breadcrumb Component', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=breadcrumb--default');
	});

	it('should render the breadcrumb component', () => {
		cy.get('hlm-breadcrumb').should('exist');
	});

	it('should contain the correct breadcrumb items', () => {
		cy.get('hlm-breadcrumb ol li').should('have.length', 7);
		cy.get('hlm-breadcrumb ol li').eq(0).contains('Home');
		cy.get('hlm-breadcrumb ol li').eq(4).contains('Components');
		cy.get('hlm-breadcrumb ol li').eq(6).contains('Breadcrumb');
	});

	it('should contain breadcrumb separators', () => {
		cy.get('hlm-breadcrumb-separator').should('have.length', 3);
	});

	it('should contain breadcrumb ellipsis', () => {
		cy.get('hlm-breadcrumb-ellipsis').should('exist');
	});
});
