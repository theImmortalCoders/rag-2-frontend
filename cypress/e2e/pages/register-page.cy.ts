describe('Register Page E2E Tests:', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should describe register header correctly', () => {
    cy.get('#registerHeader').should('contain.text', 'Register new account');
  });

  it('should describe register form with all its fields correctly', () => {
    cy.get('#registerPageForm')
      .children()
      .children('input')
      .should('have.length', 4);
    cy.get('#registerPageForm').children('button').should('have.length', 1);
  });

  it('should describe side panel header correctly', () => {
    const text = 'Do you have an account already?';
    cy.get('#sidePanelUserWorkflowHeader').should('contain.text', text);
  });

  it('should navigate to login page after button clicked', () => {
    cy.get('#sidePanelNavigateButton').forceClick();
    cy.location('pathname').should('eq', '/login');
  });

  it('should have all benefits list elements available', () => {
    cy.get('#benefitsListParent').children('span').should('have.length', 4);
  });
});
