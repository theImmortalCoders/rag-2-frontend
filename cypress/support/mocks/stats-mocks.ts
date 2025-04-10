/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockGetUserStats(): Chainable<void>;
  }
}

Cypress.Commands.add('mockGetUserStats', () => {
  cy.fixture('user-stats.json').then(stats => {
    cy.intercept('GET', '/api/Stats/user?userId=1', {
      statusCode: 200,
      body: stats,
    }).as('getUserStats');
  });
});
