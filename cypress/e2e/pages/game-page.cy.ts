describe('Game Page E2E Tests:', () => {
  beforeEach(() => {
    cy.mockGetMe();
    cy.mockLogin('testuser@stud.prz.edu.pl', 'tajnehaslo123');
    cy.mockVerifyJWTToken();
    cy.mockGetGames();
    cy.wait('@getMe').its('response.statusCode').should('eq', 200);
    cy.visit('/game/pong');
    cy.wait('@verifyJWTToken').its('response.statusCode').should('eq', 200);
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/game/pong');
  });

  it('should describe game controls section after hover', () => {
    cy.get('#gameControlsParent').should('exist');
    // cy.get('#gameControlsSection').should('be.visible');
  });
});
