import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { Game2048 as oldgame } from './Game';
import { Direction, Game2048 } from './Game/Game_Manager';
import { Tile, getTileType, TilePosition } from './Game/Tile';
import { GameStorage } from './Game/Storage';

type xyz = 'x' | 'y';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = '2048';

  getTileType = getTileType;

  constructor(
    public Game: Game2048,
    private renderer: Renderer2,
    private gameStorage: GameStorage
  ) {}

  public tilePos: number[] = [];

  ngOnInit(): void {
    this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
      if (!event.key) return;
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          let direction = (event.key as string).slice(5).toLowerCase() as Direction;
          this.Game.moveEvent(direction);
          break;
      }
    });


    this.startGame();
  }

  public startGame(): void {
    this.Game = new Game2048().setSize(4).setStartingTiles(2).setScore(2048).startGame();
  }

  public getTilePosition(tile: Tile): TilePosition {

    let xyz: xyz[] = ['x', 'y'];

    let pos = [];

    for(let i = 0;i < 2;i++) {
      let x = this.tilePos[tile.position[xyz[i]]];
      if (!x) {
        x = this.tilePos[tile.position[xyz[i]]] = (this.Game.getGameMargin() * (tile.position[xyz[i]] + 1) + tile.position[xyz[i]] * this.Game.getTileSize());
      }

      pos[i] = x;
    }
    
    return {
      x: pos[0],
      y: pos[1]
    };

  }

  public TilePositionFormat(pos: TilePosition): string {
    return pos.x + 'px ' + pos.y + 'px';
  }


  public getMath(): Math {
    return Math;
  }


}
