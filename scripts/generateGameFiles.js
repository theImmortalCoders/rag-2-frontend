/* 
  #######################################################
  !!!!!                   READ ME                   !!!!!
  #######################################################

  This script is designed to generate all necessary files 
  and update existing ones during the process of creating 
  a new game in the RAG-2 system.

  The script creates or modifies the following files:
  - game.renderer.component.ts
  - games.ts
  - [newGameName].component.ts
  - [newGameName].class.ts

  Then you need to implement the rest of the game's 
  functionality like logic and view in some of these files.

  How to use the script?
  In the console, run the following command:
    npm run newGame [gameName]

  The game name should be written in lowercase letters as
  a single string, even for multi-word game names (e.g., 
  "FlappyBird" should be written as "flappybird").
*/

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI_TARGET_PATH = 'game/games';
const PROJECT_TARGET_PATH = 'src/app/game/games';
const GAMES_TS_PATH = 'src/app/game/data/games.ts';
const GAME_RENDERER_PATH =
  'src/app/game/components/game-renderer/game-renderer.component.ts';

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

  updateGameRenderer(gameName);
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
      // Render view here
    }
  }

  //
}
  `.trim();
}

function updateGameRenderer(gameName) {
  let gameRenderer = fs.readFileSync(GAME_RENDERER_PATH, 'utf-8');

  const newGameImport = `import { ${capitalize(gameName)}GameWindowComponent } from '@games/${gameName.toLowerCase()}/${gameName.toLowerCase()}.component';\n`;

  if (!gameRenderer.includes(newGameImport)) {
    const importSectionEnd = gameRenderer.indexOf('@Component({');

    if (importSectionEnd !== -1) {
      gameRenderer =
        gameRenderer.slice(0, importSectionEnd) +
        newGameImport +
        gameRenderer.slice(importSectionEnd);
    } else {
      gameRenderer = newGameImport + gameRenderer;
    }
  }

  const newImportsSection = `\t${capitalize(gameName)}GameWindowComponent`;
  const importsSectionEnd = gameRenderer.indexOf('],');

  if (importsSectionEnd !== -1) {
    gameRenderer =
      gameRenderer.slice(0, importsSectionEnd) +
      newImportsSection +
      gameRenderer.slice(importsSectionEnd);
  } else {
    gameRenderer = newImportsSection + gameRenderer;
  }

  const caseRegex = /@case/g;
  let match;
  let lastCaseIndex = -1;

  while ((match = caseRegex.exec(gameRenderer)) !== null) {
    lastCaseIndex = match.index;
  }

  if (lastCaseIndex !== -1) {
    let lines = gameRenderer.split('\n');

    const lastCaseLine =
      gameRenderer.slice(0, lastCaseIndex).split('\n').length - 1;

    const insertLine = lastCaseLine + 3;
    lines.splice(
      insertLine,
      0,
      `\t\t\t@case ('${gameName.toLowerCase()}') {
        <app-${gameName.toLowerCase()} #${gameName.toLowerCase()} [setAbstractGame]="game" />
      }`
    );

    gameRenderer = lines.join('\n');
  }

  const caseRegex2 = /QueryList</g;
  let match2;
  let lastCaseIndex2 = -1;

  while ((match2 = caseRegex2.exec(gameRenderer)) !== null) {
    lastCaseIndex2 = match2.index;
  }

  if (lastCaseIndex2 !== -1) {
    let lines = gameRenderer.split('\n');

    const lastCaseLine =
      gameRenderer.slice(0, lastCaseIndex2).split('\n').length - 1;

    const insertLine = lastCaseLine + 1;
    lines.splice(
      insertLine,
      0,
      `\t@ViewChildren(${capitalize(gameName)}GameWindowComponent)
\tpublic ${gameName}Component!: QueryList<${capitalize(gameName)}GameWindowComponent>;`
    );

    gameRenderer = lines.join('\n');
  }

  const caseRegex3 = /toArray()/g;
  let match3;
  let lastCaseIndex3 = -1;

  while ((match3 = caseRegex3.exec(gameRenderer)) !== null) {
    lastCaseIndex3 = match3.index;
  }

  if (lastCaseIndex3 !== -1) {
    let lines = gameRenderer.split('\n');

    const lastCaseLine =
      gameRenderer.slice(0, lastCaseIndex3).split('\n').length - 1;

    const insertLine = lastCaseLine + 1;
    lines.splice(
      insertLine,
      0,
      `\t\tthis._gameComponentsMap['${gameName}'] = this.${gameName}Component.toArray();`
    );

    gameRenderer = lines.join('\n');
  }

  fs.writeFileSync(GAME_RENDERER_PATH, gameRenderer, 'utf-8');
  console.log(`Updated game-renderer.component.ts with ${gameName} game data.`);
}

const gameName = process.argv[2];
generateGameFiles(gameName.toLowerCase());
