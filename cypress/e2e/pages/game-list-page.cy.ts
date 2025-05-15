/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Game List Page E2E Tests:', () => {
  beforeEach(() => {
    cy.mockGetGames();
    cy.visit('/game-list');
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
  });

  it('should display number of tiles equals to correct length', () => {
    cy.fixture('games.json').then(games => {
      cy.get('#gameTilesParent')
        .children('div')
        .should('have.length', games.length);
    });
  });

  it('should navigate to correct game page after PLAY IT button clicked', () => {
    cy.fixture('games.json').then(games => {
      games.forEach((game: any) => {
        cy.get('#gameTileButton' + game.id).forceClick();
        cy.location('pathname').should('eq', '/game/' + game.name);
        cy.visit('/game-list');
      });
    });
  });

  it('should display description of each game', () => {
    cy.fixture('games.json').then(games => {
      games.forEach((game: any) => {
        cy.get('#gameTile' + game.id).trigger('mousemove');
        cy.get('#gamePageDescriptionTile' + game.id).should('exist');
      });
    });
  });

  it('should switch tile view after DESCRIPTION/STATS button clicked', () => {
    cy.get('#gameTile1').trigger('mouseover');
    cy.get('#gamePageActionButtonTile1').forceClick();
    cy.get('#gamePageDescriptionTile1').should('not.exist');
    cy.get('#gameTile1').trigger('mouseout');
  });
});
