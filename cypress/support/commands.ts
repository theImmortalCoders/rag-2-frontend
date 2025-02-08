/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Cypress {
  interface Chainable {
    loginMock(email: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('loginMock', (email: string, password: string) => {
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
    const token = interception.response.body.token;
    window.localStorage.setItem('jwtToken', token);
  });
});
