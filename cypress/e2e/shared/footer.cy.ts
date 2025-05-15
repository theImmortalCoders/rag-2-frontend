describe('Footer E2E Tests:', () => {
  beforeEach(() => {
    //
  });

  it('should have lower section with 3 parts', () => {
    cy.get('#lowerFooterSection').children().should('have.length', 3);
  });

  it('should navigate to accessibility statement page', () => {
    cy.get('#lowerFooterSection').children('button').forceClick();
    cy.location('pathname').should('eq', '/accessibility-statement');
  });

  it('should navigate to correct GitHub accounts', () => {
    cy.get('#authorsFooterList')
      .find('li a')
      .each($link => {
        const expectedHref = $link.prop('href');

        cy.wrap($link)
          .should('have.attr', 'href')
          .and('include', 'https://github.com/');

        cy.request(expectedHref).then(response => {
          expect(response.status).to.eq(200);
        });
      });
  });

  it('should navigate to PRZ page', () => {
    cy.get('#przFooterLogo')
      .should('have.attr', 'href')
      .and('eq', 'https://w.prz.edu.pl/');
  });

  it('should navigate to GEST page', () => {
    cy.get('#gestFooterLogo')
      .should('have.attr', 'href')
      .and('eq', 'http://vision.kia.prz.edu.pl/gest/');
  });
});
