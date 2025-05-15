/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockGetGames(): Chainable<void>;
  }
}

Cypress.Commands.add('mockGetGames', () => {
  cy.fixture('games.json').then(games => {
    cy.intercept('GET', '/api/Game', {
      statusCode: 200,
      body: games,
    }).as('getGames');
  });
});
