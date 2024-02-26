import { Tile, TilePosition, TileOrNull } from './Tile';

export class Grid {
    private size: number = 4;
    public tiles: Tile[] = [];

    constructor(size: number) {
        this.size = size;
    }

    /**
     * Generate empty grid (creation purpose)
     * @returns Completely empty grid
     */
    public generateEmptyGrid(): Tile[] {
        var tileList: Tile[] = [];

        for (var x = 0; x < this.size; x++) {
          for (var y = 0; y < this.size; y++) {
            tileList.push(new Tile({ x, y}, 0));
          }
        }
        return tileList;
    }

    public getAllTiles(): Tile[] {
        return this.tiles;
    }

    public getEmptyTiles(): Tile[] {
        let tileList: Tile[] = [];
        let empty = this.generateEmptyGrid();
        empty.forEach((tile: Tile) => {
            if (!this.getTile(tile.position)) tileList.push(tile);
        });
        return tileList;
    }

    public getRandomEmptyTile(): TilePosition | null {
        let emptyTiles = this.getEmptyTiles();
        if (!emptyTiles.length) return null;
        let tile = emptyTiles[ Math.floor( Math.random() * emptyTiles.length ) ];
        return {
            x: tile.position.x,
            y: tile.position.y
        };
    }


    public getTile(position: TilePosition): TileOrNull {
        if (!this.checkCoordinates(position)) return null;
        return this.tiles.filter((tile: Tile) => tile.position.x === position.x && tile.position.y === position.y)[0] ?? null;
    }

    public insertTile(tile: Tile): void {
        this.tiles.push(tile);
    }

    public removeTile(tile: TilePosition): void {
        let t = this.getTile(tile);
        this.tiles.splice(this.tiles.indexOf(t), 1);
    }

    public tileAvailable(position: TilePosition): boolean {
        return !this.tileOccupied(position);
    }

    public tileOccupied(position: TilePosition): boolean {
        return !!this.checkCoordinates(position);
    }

    public checkCoordinates(position: TilePosition): boolean {
        return  position.x >= 0 && position.x < this.size &&
                position.y >= 0 && position.y < this.size;
    }

}