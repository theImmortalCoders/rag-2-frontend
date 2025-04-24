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

  it('should describe user`s data correctly', () => {
    cy.fixture('user.json').then(user => {
      cy.get('#dashboardNameHeader').should(
        'contain.text',
        'Hello, ' + user.name + '!'
      );
      cy.get('#dashboardRoleHeader').should('contain.text', user.role);
      cy.get('#dashboardEmailHeader').should('contain.text', user.email);
      cy.get('#dashboardYearsHeader').should(
        'contain.text',
        user.studyCycleYearA + '/' + user.studyCycleYearB
      );
      cy.get('#dashboardCourseHeader').should('contain.text', user.course.name);
      cy.get('#dashboardGroupHeader').should('contain.text', user.group);
    });
  });
});
