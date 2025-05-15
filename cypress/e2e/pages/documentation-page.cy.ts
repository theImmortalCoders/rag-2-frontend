describe('Documentation Page E2E Tests:', () => {
  beforeEach(() => {
    cy.visit('/documentation');
  });

  it('should describe landing page title correctly', () => {
    cy.get('#documentationPageHeader').should(
      'contain.text',
      'Check the documentation we prepared to help:'
    );
  });

  it('should describe at least 3 documentation tiles', () => {
    cy.get('#documentationTilesContainer')
      .children('app-single-doc')
      .should('have.length.at.least', 3);
  });
});
