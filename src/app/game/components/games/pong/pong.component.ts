import { Component, OnInit } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { BaseGameWindowComponent } from '../base-game.component';
import { Player } from 'app/game/models/player.class';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-pong',
  standalone: true,
  template: `
    PONG
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement1
      type="text"
      [value]="defaultText"
      (input)="updateOutputData1(inputElement1.value)" />
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement2
      type="text"
      [value]="defaultText + '2'"
      (input)="updateOutputData2(inputElement2.value)" />
    <div>P1 Move: {{ p1Move }}</div>
    <div>P2 Move: {{ p2Move }}</div>
  `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit
{
  public p1Move = 0;
  public p2Move = 0;
  public defaultText = 'PONG';

  public override ngOnInit(): void {
    this.emitOutputData();
    this.players[0].inputData = {
      move: 0,
    };
    this.players[0].expectedDataDescription =
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up';
    this.players[1].inputData = {
      move: 0,
    };
    this.players[1].expectedDataDescription =
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up';
  }

  protected override gameWindowOutputData: TExchangeData = {
    text: this.defaultText,
    text2: this.defaultText + '2',
    p1Move: this.p1Move,
    p2Move: this.p2Move,
  };

  public override set setSocketInputDataReceive(value: TExchangeData) {
    const data = value['data'] as TExchangeData;
    if (!data) return;
    if (
      JSON.stringify(value['player'] as Player) ===
      JSON.stringify(this.players[0])
    ) {
      this.p1Move = data['move'] ? (data['move'] as number) : 0;
    } else if (
      JSON.stringify(value['player'] as Player) ===
      JSON.stringify(this.players[1])
    ) {
      this.p2Move = data['move'] ? (data['move'] as number) : 0;
    }
    this.gameWindowOutputData['p1Move'] = this.p1Move;
    this.gameWindowOutputData['p2Move'] = this.p2Move;
    this.emitOutputData();
  }

  public updateOutputData1(value: string): void {
    this.gameWindowOutputData['text'] = value;
    this.emitOutputData();
  }

  public updateOutputData2(value: string): void {
    this.gameWindowOutputData['text2'] = value;
    this.emitOutputData();
  }
}
