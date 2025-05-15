/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockGetStorageLimits(): Chainable<void>;
  }
}

Cypress.Commands.add('mockGetStorageLimits', () => {
  cy.fixture('limits.json').then(limits => {
    cy.intercept('GET', '/api/Administration/limits', {
      statusCode: 200,
      body: limits,
    }).as('getStorageLimits');
  });
});
