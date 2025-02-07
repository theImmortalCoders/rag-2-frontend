const viewports: [number, number][] = [
  [375, 812], // iPhone X
  [768, 1024], // Tablet vertical
  [1024, 768], // Tablet horizontal
  [1280, 720], // Desktop
  [1920, 1080], // Full HD Desktop
];

viewports.forEach(size => {
  beforeEach(() => {
    cy.viewport(size[0], size[1]);
    cy.log(`Testing in resolution: ${size[0]}x${size[1]}`);
  });
});
