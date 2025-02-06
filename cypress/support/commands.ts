Cypress.Commands.add('clearLocalStorage', () => {
  cy.clearLocalStorage();
  cy.reload();
});
