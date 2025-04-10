/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockGetRecordedGamesPong(): Chainable<void>;
  }
}

Cypress.Commands.add('mockGetRecordedGamesPong', () => {
  cy.fixture('recorded-games-pong.json').then(games => {
    cy.intercept(
      'GET',
      '/api/GameRecord?gameId=1&userId=1&sortBy=Ended&sortDirection=Asc',
      {
        statusCode: 200,
        body: games,
      }
    ).as('getRecordedGamesPong');
  });
});
