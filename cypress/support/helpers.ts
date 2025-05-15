/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    forceClick(): Chainable<void>;
  }
}

Cypress.Commands.add('forceClick', { prevSubject: 'element' }, subject => {
  cy.wrap(subject).click({ force: true });
});
