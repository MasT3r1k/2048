/** Game configuration */

class Game2048 {
    private config: GameConfig = {
        gameWidth: 500,
        tileMargin: 12,
        tileCount: 4
    }

    /**
     * @returns All the game configuration
     */
    public getConfig(): GameConfig {
        return this.config;
    }

    private score: number = 0;
    private backgroundTiles: Tile[] = [];
    private usedTiles: Tile[] = [];

    constructor(
        tiles: number = 4
    ) {
        this.config.tileCount = tiles;

        this.startGame();
    }

    public startGame(): void {
        this.usedTiles = [];
        this.backgroundTiles = [];
        for(let i = 0;i < this.config.tileCount * this.config.tileCount;i++) {
            this.backgroundTiles.push({ x: i % 4, y: Math.floor(i / 4), num: 0 });
        }
        this.score = 0;
        this.generateTile(2);
    }

    public getTileSize(): number {
        return (((this.config.gameWidth - this.config.tileMargin * (this.config.tileCount + 1)) / this.config.tileCount));
    }

    public getEmptyTiles(): Tile[] {
        return this.backgroundTiles.filter((tile: Tile) => tile.num === 0);
    }

    public getTileByCoordinates(x: number, y: number): Tile {
        return this.backgroundTiles.filter((tile: Tile) => tile.x === x && tile.y === y)[0];
    }
    
    public getUsedTiles(): Tile[] {
        return this.usedTiles.filter((tile: Tile) => tile.num !== 0);
    }

    public generateTile(num: number = 1): void {
        for(let i = 0;i < num;i++) {
          let emptyTiles = this.getEmptyTiles();
          let tile = emptyTiles[ Math.floor( Math.random() * emptyTiles.length ) ];
          tile.num = 1;
          this.usedTiles.push({ x: tile.x, y: tile.y, num: 1 });
        }
    }

    public getAllEmptyTiles(): Tile[] {
        let t: Tile[] = [];
        for(let i = 0;i < this.config.tileCount * this.config.tileCount;i++) {
            t.push({ x: i % 4, y: Math.floor(i / 4), num: 0 });
        }
        return t;
    }

}



// TYPES
import type { Tile, TileConfig, GameConfig } from './Game.d';
export type {Tile, TileConfig, GameConfig};
export { Game2048 };