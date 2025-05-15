/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Cypress {
  interface Chainable {
    mockLogin(email: string, password: string): Chainable<void>;
    mockVerifyJWTToken(): Chainable<void>;
    mockGetMe(): Chainable<void>;
  }
}

Cypress.Commands.add('mockLogin', (email: string, password: string) => {
  cy.intercept('POST', '/api/Auth/login', req => {
    if (req.body.email === email && req.body.password === password) {
      req.reply({
        statusCode: 200,
        body: { message: 'Login successful', token: 'sampleJWTToken12345' },
      });
    } else {
      req.reply({
        statusCode: 401,
        body: {
          message: 'Invalid password or mail not confirmed or user banned',
        },
      });
    }
  }).as('loginRequest');

  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.wait('@loginRequest').then(interception => {
    const token = interception.response?.body.token;
    window.localStorage.setItem('jwtToken', token);
  });
});

Cypress.Commands.add('mockVerifyJWTToken', () => {
  cy.intercept('GET', '/api/Auth/verify', req => {
    req.reply({ statusCode: 200, body: {} });
  }).as('verifyJWTToken');
});

Cypress.Commands.add('mockGetMe', () => {
  cy.fixture('user.json').then(user => {
    cy.intercept('GET', '/api/Auth/me', {
      statusCode: 200,
      body: user,
    }).as('getMe');
  });
});
