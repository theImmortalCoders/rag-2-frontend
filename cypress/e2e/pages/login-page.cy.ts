describe('Login Page E2E Tests:', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should describe login header correctly', () => {
    cy.get('#loginHeader').should('contain.text', 'Log in');
  });

  it('should describe login form with all its fields correctly', () => {
    cy.get('#loginPageForm')
      .children()
      .children('input')
      .should('have.length', 3);
    cy.get('#loginPageForm').children('button').should('have.length', 1);
  });

  it('should open new section after clicked the FORGOT YOUR PASSWORD button', () => {
    cy.get('#forgotPasswordButton').forceClick();
    cy.get('#forgotPasswordSectionForm').should('be.visible');
  });

  it('should describe side panel header correctly', () => {
    const text = "Don't you have an account yet?";
    cy.get('#sidePanelUserWorkflowHeader').should('contain.text', text);
  });
});
