describe('Navbar E2E Tests', () => {
  it('logo should navigate to home page correctly', () => {
    cy.get('#navbarLogo').click();
    cy.location('pathname').should('eq', '/');
  });

  it('headline should navigate to home page correctly (execept mobiles)', () => {
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
});
