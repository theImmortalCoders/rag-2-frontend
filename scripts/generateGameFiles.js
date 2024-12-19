const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI_TARGET_PATH = 'game/games';
const PROJECT_TARGET_PATH = 'src/app/game/games';

function generateGameComponent(componentName) {
  if (!componentName) {
    console.error('Error: Component name is required.');
    process.exit(1);
  }

  const componentPath = path.join(PROJECT_TARGET_PATH, componentName);
  const modelsPath = path.join(componentPath, 'models');
  const classFilePath = path.join(modelsPath, `${componentName}.class.ts`);
  const componentFilePath = path.join(
    componentPath,
    `${componentName}.component.ts`
  );
  const stateClassName = `${capitalize(componentName)}State`;
  const gameClassName = `${capitalize(componentName)}`;

  const command = `npx ng g c ${CLI_TARGET_PATH}/${componentName} --skip-tests`;

  console.log(`Running command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Component created successfully:\n${stdout}`);

    fs.mkdir(modelsPath, { recursive: true }, err => {
      if (err) {
        console.error(`Failed to create 'models' folder: ${err.message}`);
        return;
      }

      const classFileContent = `
import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class ${stateClassName} implements TGameState {
    // to implement
}

export class ${gameClassName} extends Game {
    public override name = '${componentName.toLowerCase()}';
    public override state = new ${stateClassName}();

    public override outputSpec = \`\`;
    public override players = [
        //to implement
        //new Player()
    ];
}
      `.trim();

      fs.writeFile(classFilePath, classFileContent, err => {
        if (err) {
          console.error(`Failed to create class file: ${err.message}`);
          return;
        }
        console.log(`Class file created: ${classFilePath}`);
      });
    });

    const componentFileContent = getComponentFileContent(
      componentName,
      stateClassName,
      gameClassName
    );

    fs.writeFile(componentFilePath, componentFileContent, err => {
      if (err) {
        console.error(`Failed to create component file: ${err.message}`);
        return;
      }
      console.log(`Component file created: ${componentFilePath}`);
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getComponentFileContent(componentName, stateClassName, gameClassName) {
  return `
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { ${gameClassName}, ${stateClassName} } from './models/${componentName.toLowerCase()}.class';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  standalone: true,
  imports: [CanvasComponent],
  template: \`
    <!-- Other HTML -->
    <app-canvas
      [displayMode]="'horizontal'"
      class="bg-zinc-300"
      #gameCanvas></app-canvas>
    <b>FPS: {{ fps }}</b> \`,
})
export class ${gameClassName}Component
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  //Initialize all constant (non sending) variables

  public override game!: ${gameClassName};

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.game as ${gameClassName};
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.render();

    // Other logic
  }

  public override restart(): void {
    this.game.state = new ${stateClassName}();

    // Other logic
  }

  protected override update(): void {
    super.update();
    this.render();

    // Other logic
  }

  //

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      // Render logic here
    }
  }
}
  `.trim();
}

const gameName = process.argv[2];
generateGameComponent(gameName);
