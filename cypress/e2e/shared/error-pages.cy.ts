describe('Error Pages E2E Tests:', () => {
  beforeEach(() => {
    //
  });

  it('should display error404 header correctly ', () => {
    cy.visit('/error404');
    cy.get('#headerError404').should('contain.text', 'ERROR 404');
  });

  it('should display error500 header correctly ', () => {
    cy.visit('/error500');
    cy.get('#headerError500').should('contain.text', 'ERROR 500');
  });
});
