/** Game configuration */

@Injectable()
class Game2048 {
  private renderer: Renderer2;
  private config: GameConfig = {
    gameWidth: 500,
    tileMargin: 12,
    tileCount: 4,
  };

  /**
   * @returns All the game configuration
   */
  public getConfig(): GameConfig {
    return this.config;
  }

  private tileTypes: TileConfig[] = [
    { background: '#c1b3a4', color: 'transparent' }, // 0
    { background: '#eee4da', color: '#776e65' }, // 2
    { background: '#ede0c8', color: '#776e65' }, // 4
    { background: '#f2b179', color: '#f9f6f2' }, // 8
    { background: '#f59563', color: '#f9f6f2' }, // 16
    { background: '#f67c5f', color: '#f9f6f2' }, // 32
    { background: '#f65e3b', color: '#f9f6f2' }, // 64
    { background: '#edcf72', color: '#f9f6f2' }, // 128
    { background: '#edcc61', color: '#f9f6f2' }, // 256
    { background: '#edc850', color: '#f9f6f2' }, // 512
    { background: '#edc53f', color: '#f9f6f2' }, // 1024
    { background: '#edc22e', color: '#f9f6f2' }, // 2048
  ];

  /**
   * Get tile's background and text's color of tile
   * @param num index of number (2ⁿ)
   * @returns background and color of tile (in hex format)
   * @example { background: 'hex', color: 'hex' }
   */
  public getTileInfo(num: number): TileConfig {
    if (num < 0) return this.tileTypes[0];
    if (num >= this.tileTypes.length)
      return this.tileTypes[this.tileTypes.length - 1];

    return this.tileTypes[num];
  }

  private score: number = 0;
  private backgroundTiles: TilePosition[] = [];
  private usedTiles: Tile[] = [];
  private needAgain: Tile[] = [];

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.listenEvents();
    this.startGame();
  }

  public startGame(): void {
    this.usedTiles = [];
    this.backgroundTiles = [];
    for (let i = 0; i < this.config.tileCount * this.config.tileCount; i++) {
      this.backgroundTiles.push({
        x: i % 4,
        y: Math.floor(i / 4),
      });
    }
    this.score = 0;
    this.generateTile(2);
  }

  public move(tile: Tile, directionBeforeChange: Direction): void {
    
    let direction = directionBeforeChange.toLowerCase() as Direction;

    if (!tile || !direction) { return; }
    let y = 0;
    switch (direction) {
      case 'up':
        y = tile.y;
        break;
    case 'left':
        y = tile.x;
        break;
      case 'down':
      case 'right':
        y = this.config.tileCount - 1;
        break;
    }

    for (let i = 0; i < y; i++) {
      let next = { x: tile.x, y: tile.y };
      switch (direction) {
        case 'up':
          next.y--;
          break;
        case 'down':
          next.y++;
          break;
        case 'left':
          next.x--;
          break;
        case 'right':
          next.x++;
          break;
        default:
          // Huh?
          break;
      }
      let nextTile = this.getTileByCoordinates(next.x, next.y);
      if (nextTile && nextTile.num !== 0) {
        if (tile.num === nextTile.num) {
            // Merging
            this.makeMerging(nextTile.x, nextTile.y, true);
            this.addNumberToTile(nextTile.x, nextTile.y);
            nextTile.num++;
            this.resetTile(tile.x, tile.y);
            this.removeTile(tile.x, tile.y);
            let aTile = this.usedTiles.filter(
            (xtile: Tile) => xtile.x === next.x && xtile.y === next.y
            )[0];
            if (aTile) {
            this.move(aTile, direction);
            }
            setTimeout(() => {
            this.makeMerging(nextTile.x, nextTile.y, false);
            }, 350);
        } else {
            // Moving to prevent blocking
            this.needAgain.push(tile);
        }
        return;
      }
      // Moving
      if ((!nextTile || nextTile.num === 0) && ((tile.x > 0 && direction == 'left') || (tile.x < this.config.tileCount - 1 && direction == 'right') || (tile.y > 0 && direction == 'up') || (tile.y < this.config.tileCount - 1 && direction == 'down'))) {
        switch (direction) {
          case 'up':
            tile.y--;
            break;
          case 'down':
            tile.y++;
            break;
          case 'left':
            tile.x--;
            break;
          case 'right':
            tile.x++;
            break;
          default:
            // Huh?
            break;
        }
      }
    }
  }

  public listenEvents(): void {
    fromEvent(window, 'keydown').pipe(
        debounceTime(25)
      ).subscribe((event: any): void => {
        if (!event.key) return;
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                // this.generateTile(1);   
                let direction = event.key.slice(5) as Direction;
                this.needAgain = [];
                this.usedTiles.forEach((tile: Tile) => {
                    this.move(tile, direction);
                });
                this.needAgain.forEach((tile: Tile) => this.move(tile, direction));
                break;
        }
    });
  }

  public getTileSize(): number {
    return (
      (this.config.gameWidth -
        this.config.tileMargin * (this.config.tileCount + 1)) /
      this.config.tileCount
    );
  }

  public getEmptyTiles(): TilePosition[] {
    let empty: TilePosition[] = JSON.parse(JSON.stringify(this.backgroundTiles));
    this.usedTiles.forEach((tile: Tile) => {
        empty.splice(empty.findIndex((deleteTile: TilePosition) => deleteTile.x === tile.x && deleteTile.y === tile.y), 1);
    });
    return empty;
  }

  public getTileByCoordinates(x: number, y: number): Tile {
    return this.usedTiles.filter(
      (tile: Tile) => tile.x === x && tile.y === y
    )?.[0];
  }

  public getUsedTiles(): Tile[] {
    return this.usedTiles.filter((tile: Tile) => tile.num !== 0);
  }

  public makeMerging(x: number, y: number, merging: boolean = true): void {
    let tile = this.usedTiles.filter(
      (tile: Tile) => tile.x === x && tile.y === y
    )[0];
    if (!tile) return;
    tile.status = merging ? 'merging' : 'idle';
  }

  public resetTile(x: number, y: number): void {
    let tile = this.getTileByCoordinates(x, y);
    if (!tile) return;
    tile.num = 0;
  }

  public removeTile(x: number, y: number): void {
    let usedTile = this.usedTiles.indexOf(
      this.usedTiles.filter((tile: Tile) => tile.x === x && tile.y === y)[0]
    );
    if (usedTile === -1) return;
    this.usedTiles.splice(usedTile, 1);
  }

  public addNumberToTile(x: number, y: number): void {
    let tile = this.usedTiles.filter(
      (tile: Tile) => tile.x === x && tile.y === y
    )[0];
    if (!tile) return;
    tile.num++;
  }

  public generateTile(num: number = 1): void {
    for (let i = 0; i < num; i++) {
      let emptyTiles = this.getEmptyTiles();
      if (emptyTiles.length === 0) {
        console.error('Game over!');
        return;
      }
      let tile = emptyTiles[ Math.floor( Math.random() * emptyTiles.length ) ];
      this.usedTiles.push({
        x: tile.x,
        y: tile.y,
        num: 1,
        status: 'appearing',
      });
      setTimeout(() => {
        let usedTile = this.usedTiles.filter(
          (usedTile: Tile) => usedTile.x === tile.x && usedTile.y === tile.y
        )[0];

        if (!usedTile) return;
        usedTile.status = 'idle';
      }, 200);
    }
  }

  public getAllEmptyTiles(): TilePosition[] {
    return this.backgroundTiles;
  }

  public getInformation(): void {
    console.log(this.usedTiles);
    console.log(this.backgroundTiles);
  }

}

import { Directive, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
// TYPES
import type {
  Tile,
  TileConfig,
  TileStatus,
  GameConfig,
  Direction,
  TilePosition,
} from './Game.d';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs';
export type { Tile, TileConfig, TileStatus, GameConfig, Direction, TilePosition };
export { Game2048 };
