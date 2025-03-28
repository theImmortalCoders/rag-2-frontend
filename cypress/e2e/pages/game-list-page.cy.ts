/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Game List Page E2E Tests:', () => {
  beforeEach(() => {
    cy.visit('/game-list');
    cy.mockGetGames();
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
  });

  it('should describe landing page title correctly', () => {
    cy.get('#gameListPageHeader').should(
      'contain.text',
      'Check details about our games:'
    );
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

  //   it('should switch tile view after DESCRIPTION/STATS button clicked', () => {
  //     cy.fixture('games.json').then(games => {
  //       games.forEach((game: any) => {
  //         cy.get('#gameTile' + game.id).trigger('mousemove');
  //         cy.get('#gamePageActionButtonTile' + game.id).forceClick();
  //         cy.get('#gamePageDescriptionTile' + game.id).should('not.exist');
  //       });
  //     });
  //   });
});
