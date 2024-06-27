describe('Pong Game Page', () => {
  it('Visits the Pong game page', () => {
    cy.visit('/game/pong');
    cy.contains('pong');
  });
});

describe('Home Page', () => {
  it('Visits the home page', () => {
    cy.visit('');
    cy.contains('RUT-AI GAMES');
  });
});
