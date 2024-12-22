const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI_TARGET_PATH = 'game/games';
const PROJECT_TARGET_PATH = 'src/app/game/games';
const GAMES_TS_PATH = 'src/app/game/data/games.ts'; // Ścieżka do pliku games.ts

function generateGameFiles(gameName) {
  if (!gameName) {
    console.error('Error: Component name is required.');
    process.exit(1);
  }

  const componentPath = path.join(PROJECT_TARGET_PATH, gameName);
  const modelsPath = path.join(componentPath, 'models');
  const classFilePath = path.join(modelsPath, `${gameName}.class.ts`);
  const componentFilePath = path.join(
    componentPath,
    `${gameName}.component.ts`
  );
  const stateClassName = `${capitalize(gameName)}State`;
  const gameClassName = `${capitalize(gameName)}`;

  const command = `npx ng g c ${CLI_TARGET_PATH}/${gameName} --skip-tests`;

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
    public override name = '${gameName.toLowerCase()}';
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
      gameName,
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

    // Aktualizacja pliku games.ts
    updateGamesTs(gameName);
  });
}

function updateGamesTs(gameName) {
  // Odczytujemy plik games.ts
  let gamesTsContent = fs.readFileSync(GAMES_TS_PATH, 'utf-8');

  // Tworzymy nowy import
  const newGameImport = `import { ${capitalize(gameName)} } from '../games/${gameName.toLowerCase()}/models/${gameName.toLowerCase()}.class';\n`;

  // Dodajemy import tylko jeśli nie istnieje
  if (!gamesTsContent.includes(newGameImport)) {
    // Sprawdzamy, czy plik zaczyna się od importów
    const importSectionEnd = gamesTsContent.indexOf('export const games:');

    if (importSectionEnd !== -1) {
      // Wstawiamy import zaraz po ostatnim importzie
      gamesTsContent =
        gamesTsContent.slice(0, importSectionEnd) +
        newGameImport +
        gamesTsContent.slice(importSectionEnd);
    } else {
      // Jeśli nie ma sekcji importów, dodajemy na początku
      gamesTsContent = newGameImport + gamesTsContent;
    }

    fs.writeFileSync(GAMES_TS_PATH, gamesTsContent, 'utf-8');
    console.log(`Added import for ${gameName} to games.ts`);
  } else {
    console.log(`Import for ${gameName} already exists in games.ts`);
  }

  // Tworzymy nowy rekord w obiekcie games
  const newGameEntry = `  ${gameName.toLowerCase()}: new ${capitalize(gameName)}(),\n`;

  // Dodajemy nową grę przed końcem obiektu games
  const objectEnd = gamesTsContent.lastIndexOf('};');
  const updatedGamesTs =
    gamesTsContent.substring(0, objectEnd) +
    newGameEntry +
    gamesTsContent.substring(objectEnd);

  fs.writeFileSync(GAMES_TS_PATH, updatedGamesTs, 'utf-8');
  console.log(`Added ${gameName} game to the games object in games.ts`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getComponentFileContent(gameName, stateClassName, gameClassName) {
  return `
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { ${gameClassName}, ${stateClassName} } from './models/${gameName.toLowerCase()}.class';

@Component({
  selector: 'app-${gameName.toLowerCase()}',
  standalone: true,
  imports: [CanvasComponent],
  template: \`
    <app-canvas
      [displayMode]="'horizontal'"
      class="bg-zinc-300"
      #gameCanvas></app-canvas>
    <b>FPS: {{ fps }}</b> \`,
})
export class ${gameClassName}GameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public override game!: ${gameClassName};

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.game as ${gameClassName};
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.render();
  }

  public override restart(): void {
    this.game.state = new ${stateClassName}();
  }

  protected override update(): void {
    super.update();
    this.render();
  }

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
generateGameFiles(gameName);
