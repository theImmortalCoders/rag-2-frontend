describe('Dashboard Page E2E Tests:', () => {
  beforeEach(() => {
    cy.mockGetMe();
    cy.mockLogin('testuser@stud.prz.edu.pl', 'tajnehaslo123');
    cy.mockGetUserStats();
    cy.mockGetGames();
    cy.mockGetRecordedGamesPong();
    cy.mockGetStorageLimits();
    cy.wait('@getMe').its('response.statusCode').should('eq', 200);
    cy.get('#userShortcutButton').forceClick();
    cy.get('#userShortcutMenuDashboardButton').forceClick();
    cy.mockVerifyJWTToken();
    cy.wait('@verifyJWTToken').its('response.statusCode').should('eq', 200);
    cy.wait('@getUserStats').its('response.statusCode').should('eq', 200);
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
    cy.wait('@getRecordedGamesPong')
      .its('response.statusCode')
      .should('eq', 200);
    cy.wait('@getStorageLimits').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/dashboard');
  });

  it('test', () => {
    //
  });
});
