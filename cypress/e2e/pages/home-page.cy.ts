describe('Home Page E2E Tests:', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should describe landing page title correctly', () => {
    cy.contains(
      'Rzeszów University of Technology Games for Artificial Intelligence 2.0'
    ).should('be.visible');
  });

  it('should animate h2 correctly', () => {
    cy.get('#animatedHeader').first().click();
    cy.contains('Meet the authors:').should('be.visible');
  });

  it('should open author card correctly', () => {
    cy.get('#authorsButton').first().click();
    cy.get('#authorCards').first().should('be.visible');
  });

  it('should navigate to game-list page correctly', () => {
    cy.get('#checkGameListButton').click();
    cy.location('pathname').should('eq', '/game-list');
  });
});
