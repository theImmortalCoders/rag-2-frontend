describe('Navbar E2E Tests:', () => {
  beforeEach(() => {
    cy.mockGetGames();
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
  });

  it('logo should navigate to home page correctly', () => {
    cy.get('#navbarLogo').click();
    cy.location('pathname').should('eq', '/');
  });

  it('headline should navigate to home page correctly (except mobiles)', () => {
    cy.window().then(win => {
      if (win.innerWidth > 768) {
        cy.get('#navbarHeadline').click();
        cy.location('pathname').should('eq', '/');
      } else {
        cy.get('#navbarHeadline').should('be.null');
      }
    });
  });

  it('lets play button should open game-list menu', () => {
    cy.get('#toggleGameListButton').click();
    cy.get('#gameListMenu').should('have.class', 'opacity-100');
  });

  it('game-list menu should navigate to correct game', () => {
    cy.get('#toggleGameListButton').click();
    cy.get('#gameListElement').first().click();
    cy.get('#gameListElement')
      .first()
      .invoke('attr', 'href')
      .then(href => {
        cy.location('pathname').should('eq', href);
      });
  });

  it('game-list menu should navigate to game-list page', () => {
    cy.get('#toggleGameListButton').click();
    cy.get('#seeAllGamesButton').click();
    cy.location('pathname').should('eq', '/game-list');
  });

  it('user shortcut should navigate to login page (not logged in)', () => {
    cy.get('#userShortcutButton').click();
    cy.location('pathname').should('eq', '/login');
  });

  it('user shortcut should open user menu and display correct role (logged in)', () => {
    cy.fixture('user.json').then(user => {
      cy.mockGetMe();
      cy.mockLogin('testuser@stud.prz.edu.pl', 'tajnehaslo123');
      cy.wait('@getMe').its('response.statusCode').should('eq', 200);
      cy.get('#userShortcutButton').click();
      cy.get('#userShortcutMenu').should('be.visible');
      cy.get('#userShortcutMenuRole').should(
        'have.text',
        'Your role: ' + user.role
      );
    });
  });

  it('user shortcut should open user menu and navigate to dashboard correctly (logged in)', () => {
    cy.mockGetMe();
    cy.mockLogin('testuser@stud.prz.edu.pl', 'tajnehaslo123');
    cy.wait('@getMe').its('response.statusCode').should('eq', 200);
    cy.get('#userShortcutButton').click();
    cy.get('#userShortcutMenuDashboardButton').click();
    cy.mockVerifyJWTToken();
    cy.wait('@verifyJWTToken').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/dashboard');
  });
});
