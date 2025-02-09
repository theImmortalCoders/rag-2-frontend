/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockGetGames(): Chainable<void>;
  }
}

Cypress.Commands.add('mockGetGames', () => {
  cy.intercept('GET', '/api/Game', req => {
    req.reply({
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'pong',
          description: 'pong description',
        },
        {
          id: 2,
          name: 'skijump',
          description: 'skijump description',
        },
        {
          id: 3,
          name: 'flappybird',
          description: 'flappybird description',
        },
      ],
    });
  }).as('getGames');
});
