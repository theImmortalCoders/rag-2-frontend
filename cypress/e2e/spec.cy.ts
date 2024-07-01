describe('Pong Game Page', () => {
  it('Visits the Pong game page', () => {
    cy.visit('/game/pong');
    cy.contains('PONG');
  });
});

describe('Home Page', () => {
  it('Visits the home page', () => {
    cy.visit('');
    cy.contains('RAG-2');
  });
});
