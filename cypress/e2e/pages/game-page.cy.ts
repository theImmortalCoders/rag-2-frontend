/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Game Page E2E Tests:', () => {
  beforeEach(() => {
    cy.mockGetMe();
    cy.mockLogin('testuser@stud.prz.edu.pl', 'tajnehaslo123');
    cy.mockVerifyJWTToken();
    cy.mockGetGames();
    cy.wait('@getMe').its('response.statusCode').should('eq', 200);
    cy.visit('/game/pong');
    cy.wait('@verifyJWTToken').its('response.statusCode').should('eq', 200);
    cy.wait('@getGames').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/game/pong');
  });

  it('should describe game controls section after hover', () => {
    cy.get('#gameControlsParent').realHover();
    cy.get('#gameControlsSection').should('be.visible');
  });

  it('should start the game after SPACE button clicked', () => {
    let before: any;

    cy.get('canvas').then($canvas => {
      before = $canvas[0].toDataURL();
    });

    cy.get('body').realPress('Space');

    cy.wait(500);

    cy.get('canvas').then($canvas => {
      const after = $canvas[0].toDataURL();
      expect(after).to.not.equal(before);
    });
  });

  it('should PAUSE, RESUME and RESTART the game after correct game menu button is clicked', () => {
    let before: any;

    //PAUSE
    cy.get('body').realPress('Space');

    cy.get('canvas').then($canvas => {
      before = $canvas[0].toDataURL();
    });

    cy.get('#gamePauseResumeButton').forceClick();

    cy.wait(500);

    cy.get('canvas').then($canvas => {
      const after = $canvas[0].toDataURL();
      expect(after).not.to.equal(before);
    });

    //RESUME
    cy.get('canvas').then($canvas => {
      before = $canvas[0].toDataURL();
    });

    cy.get('#gamePauseResumeButton').forceClick();

    cy.wait(500);

    cy.get('canvas').then($canvas => {
      const after = $canvas[0].toDataURL();
      expect(after).not.to.equal(before);
    });

    //RESTART
    cy.get('#gameRestartButton').forceClick();

    cy.wait(250);

    cy.get('canvas').then($canvas => {
      before = $canvas[0].toDataURL();
    });

    cy.wait(250);

    cy.get('#gameRestartButton').forceClick();

    cy.wait(250);

    cy.get('canvas').then($canvas => {
      const after = $canvas[0].toDataURL();
      expect(after).to.equal(before);
    });
  });
});
