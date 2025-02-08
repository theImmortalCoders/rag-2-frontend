import './commands';
import './responsive';

Cypress.on('uncaught:exception', err => {
  console.warn('Ignorowany błąd:', err.message);
  return false;
});

beforeEach(() => {
  cy.clearLocalStorage();
  cy.visit('/');
  cy.get('#cookieButton').click();
  cy.get('#testPhaseButton').click();
});
