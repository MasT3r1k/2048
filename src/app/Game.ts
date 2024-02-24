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
  private backgroundTiles: Tile[] = [];
  private usedTiles: Tile[] = [];

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
        num: 0,
        status: 'idle',
      });
    }
    this.score = 0;
    this.generateTile(2);
  }

  public moveUpTest(): void {
    this.usedTiles.forEach((tile: Tile) => {
      if (tile.y === 0) return;
      let y = tile.y;
      for (let i = 0; i < y; i++) {
        let upperTile = this.getTileByCoordinates(tile.x, tile.y - 1);
        if (upperTile.num !== 0 && upperTile.num !== tile.num) return; // Nothing :(

        if (upperTile.num === tile.num) {
          // Merging
          console.log('Merging');
          this.makeMerging(upperTile.x, upperTile.y, true);
          this.addNumberToTile(upperTile.x, upperTile.y);
          upperTile.num++;
          this.resetTile(tile.x, tile.y);
          this.removeTile(tile.x, tile.y);
          setTimeout(() => {
            this.makeMerging(upperTile.x, upperTile.y, false);
          }, 350);
          this.moveUpTest();
        }

        if (upperTile.num === 0) {
          // Moving
          this.resetTile(tile.x, tile.y);
          tile.y--;
          upperTile.num = tile.num;
        }
      }
    });
  }

  public listenEvents(): void {
    this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
      if (!event.key) return;
      switch (event.key) {
        case 'ArrowUp':
          this.usedTiles.forEach((tile: Tile) => {
            if (tile.y === 0) return;
            let y = tile.y;
            for (let i = 0; i < y; i++) {
              let upperTile = this.getTileByCoordinates(tile.x, tile.y - 1);
              if (upperTile.num !== 0 && upperTile.num !== tile.num) return; // Nothing :(

              if (upperTile.num === tile.num) {
                // Merging
                console.log('Merging');
                this.makeMerging(upperTile.x, upperTile.y, true);
                this.addNumberToTile(upperTile.x, upperTile.y);
                upperTile.num++;
                this.resetTile(tile.x, tile.y);
                this.removeTile(tile.x, tile.y);
                setTimeout(() => {
                  this.makeMerging(upperTile.x, upperTile.y, false);
                }, 350);
              }

              if (upperTile.num === 0) {
                // Moving
                this.resetTile(tile.x, tile.y);
                tile.y--;
                upperTile.num = tile.num;
              }
            }
          });
          break;
        case 'ArrowDown':
          this.usedTiles.forEach((tile: Tile) => {
            if (tile.y === this.config.tileCount - 1) return;
            let y = tile.y;
            for (let i = this.config.tileCount - 1; i > y; i--) {
              let downTile = this.getTileByCoordinates(tile.x, tile.y + 1);
              if (downTile.num !== 0 && downTile.num !== tile.num) return;
              if (downTile.num === 0) {
                this.resetTile(tile.x, tile.y);
                tile.y++;
                downTile.num = tile.num;
              }
            }
          });
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

  public getEmptyTiles(): Tile[] {
    return this.backgroundTiles.filter((tile: Tile) => tile.num === 0);
  }

  public getTileByCoordinates(x: number, y: number): Tile {
    return this.backgroundTiles.filter(
      (tile: Tile) => tile.x === x && tile.y === y
    )[0];
  }

  public getUsedTiles(): Tile[] {
    return this.usedTiles.filter((tile: Tile) => tile.num !== 0);
  }

  public makeMerging(x: number, y: number, merging: boolean = true): void {
    this.usedTiles.filter(
      (tile: Tile) => tile.x === x && tile.y === y
    )[0].status = 'merging';
  }

  public resetTile(x: number, y: number): void {
    let tile = this.getTileByCoordinates(x, y);
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
    this.usedTiles.filter((tile: Tile) => tile.x === x && tile.y === y)[0]
      .num++;
  }

  public generateTile(num: number = 1): void {
    for (let i = 0; i < num; i++) {
      let emptyTiles = this.getEmptyTiles();
      let tile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      tile.num = 1;
      this.usedTiles.push({
        x: tile.x,
        y: tile.y,
        num: 1,
        status: 'appearing',
      });
      setTimeout(
        () => {
            let usedTile = this.usedTiles.filter(
                (usedTile: Tile) =>
                (usedTile.x === tile.x &&
                usedTile.y === tile.y &&
                tile.status == 'appearing')
            )[0];

            if (!usedTile) return;
            usedTile.status = 'idle';
        }, 200);
    }
  }

  public getAllEmptyTiles(): Tile[] {
    let t: Tile[] = [];
    for (let i = 0; i < this.config.tileCount * this.config.tileCount; i++) {
      t.push({ x: i % 4, y: Math.floor(i / 4), num: 0, status: 'idle' });
    }
    return t;
  }
}

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
// TYPES
import type { Tile, TileConfig, TileStatus, GameConfig } from './Game.d';
export type { Tile, TileConfig, TileStatus, GameConfig };
export { Game2048 };
