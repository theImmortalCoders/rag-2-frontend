describe('Home Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should describe animated h1 correctly', () => {
    cy.contains("What's going on here?").should('be.visible');
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
