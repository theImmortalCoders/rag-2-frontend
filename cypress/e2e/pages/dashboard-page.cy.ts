import { formatIsoDateToDDMMYYYY } from '../../support/utils';

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

  it('should describe user`s games data correctly', () => {
    cy.fixture('user-stats.json').then(user => {
      cy.get('#dashboardGamesHeader').should('contain.text', user.games);
      cy.get('#dashboardPlaysHeader').should('contain.text', user.plays);
      const firtGameDate = formatIsoDateToDDMMYYYY(user.firstPlayed);
      cy.get('#dashboardFirstGameHeader').should('contain.text', firtGameDate);
      const lastGameDate = formatIsoDateToDDMMYYYY(user.lastPlayed);
      cy.get('#dashboardLastGameHeader').should('contain.text', lastGameDate);
      cy.get('#dashboardUsedStorage').should(
        'contain.text',
        user.totalStorageMb.toPrecision(2)
      );
    });
  });
});
