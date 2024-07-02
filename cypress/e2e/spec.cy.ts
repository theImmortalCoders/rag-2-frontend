describe('Pong Game E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/game/pong');
  });

  it('game menu loads with default settings', () => {
    cy.get('#reset').should('be.visible');
    cy.get('#socketDomainInput').should('have.value', 'localhost:8001');
  });

  it('can interact with the game menu', () => {
    cy.get('#socketDomainInput').clear().type('test:1234');
    cy.get('#reset').click();
    cy.get('#socketDomainInput').should('have.value', 'test:1234');
  });
});
