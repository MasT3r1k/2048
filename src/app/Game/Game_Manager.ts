import { ChangeDetectorRef } from "@angular/core";
import { Grid } from "./Grid";
import { TileCeil, TileOrNull, TilePosition } from "./Tile";
import { Tile } from "./Tile";
import { GameStatuses, Direction } from './Game_Manager.d';
export type { GameStatuses, Direction }

export class Game2048 {
    private sizeGrid: number = 4;
    private startingTiles: number = 2;
    private requiredScore: number = 2048;
    private width: number = 500;
    private margin: number = 12;

    public gameStatus: GameStatuses = 'running';

    constructor(
        size: number = 4,
        maxScore: number = 2048,
        public grid: Grid,
        private changeDetectorRef: ChangeDetectorRef

    ) {
        this.sizeGrid = size;
        this.requiredScore = maxScore;
        for(let i = 0;i < this.startingTiles;i++) {
            this.addRandomTile();
        }
    }



    /**
     * Compare 2 tiles position
     * @param first position of one tile
     * @param second position of the second tile
     * @returns boolean: if position is same
     */
    public isSamePosition(first: TilePosition, second: TilePosition): boolean {
        return first.x === second.x && first.y === second.y;
    }

    public getGameWidth(): number {
        return this.width;
    }

    public getGameMargin(): number {
        return this.margin;
    }

    public getTileSize(): number {
        return (
          (this.width -
            this.margin * (this.sizeGrid + 1)) /
          this.sizeGrid
        );
    }

    public addRandomTile(): void {
        if (!this.grid.getEmptyTiles().length) return;
        let tile = new Tile(this.grid.getRandomEmptyTile() as TilePosition, 2);
        
        this.grid.insertTile(tile);
    }

    public getDirectionVector(direction: Direction): TilePosition {
        let map: Record<Direction, TilePosition> = {
            up:    { x: 0, y: -1 },
            down:  { x: 0, y: 1 },
            left:  { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        }
        return map[direction];
    }

    public prepareTiles(): void {
        this.grid.getAllTiles().forEach((tile: Tile) => {
            tile.merged = null;
        });
    }

    public buildTraversals(vector: TilePosition): { x: number[], y: number[] } {
        var traversals: { x: number[], y: number[] } = { x: [], y: [] };
      
        for (var pos = 0; pos < this.sizeGrid; pos++) {
          traversals.x.push(pos);
          traversals.y.push(pos);
        }
      
        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();
      
        return traversals;
    };

    public findFarthestPosition(position: TilePosition, vector: TilePosition): { farthest: TilePosition, next: TilePosition } {
        var previous: TilePosition;

        do {
            previous = position;
            position = {
                x: previous.x + vector.x,
                y: previous.y + vector.y
            };
        } while(this.grid.checkCoordinates(position) && this.grid.getTile(position) == null);

        return {
            farthest: previous,
            next: position
        }
    }


    public moveTile(tile: Tile, second: TilePosition): void {
        tile.position = second;
    }

    public tileMatchesAvailable(): boolean {

        let tile;
        for(let x = 0;x < this.sizeGrid;x++) {
            for (let y = 0;y < this.sizeGrid;y++) {
                tile = this.grid.getTile({ x, y });
                
                if (tile) {
                    for(let i = 0;i < 4;i++) {
                        let direction: Direction[] = ['up', 'right', 'down', 'left'];
                        let vector = this.getDirectionVector(direction[i]);
                        let pos    = { x: x + vector.x, y: y + vector.y };
                        let tile2  = this.grid.getTile(pos);
    
                        if (tile2 && tile?.value === tile2.value) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    public checkIfCanContinue(): boolean {
        return !!this.grid.getEmptyTiles().length || this.tileMatchesAvailable();
    }


    public moveEvent(direction: Direction): void {
        if (this.gameStatus == 'beforeStart') {
            this.gameStatus = 'running';
        }
        if (this.gameStatus !== 'running') return;

        let pos: TilePosition, tile: TileOrNull;

        let vector: TilePosition = this.getDirectionVector(direction);
        let traversals: { x: number[], y: number[] } = this.buildTraversals(vector);
        let moved: boolean = false;

        // Reset tiles' info
        this.prepareTiles();

        traversals.x.forEach((x: number) => {
            traversals.y.forEach((y: number) => {
                pos = { x, y };
                tile = this.grid.getTile(pos);

                if (tile) {
                    let positions: { farthest: TilePosition, next: TilePosition } = this.findFarthestPosition(pos, vector);
                    let next = this.grid.getTile(positions.next);
    
                    if (next && !next.merged && tile.value === next.value) {

                        this.grid.removeTile({x: next.position.x, y: next.position.y});
                    
                        tile.position = positions.next;
                        tile.value = tile.value * 2;
                        // let merged = new Tile(positions.next, tile.value * 2);
                        tile.merged = [tile, next];
    
    
                        tile.updatePos(positions.next);
    
                        if (tile.value >= this.requiredScore) this.gameStatus = 'gameWon';
    
                    } else {
                        this.moveTile(tile, positions.farthest);
                    }
    
                    if (!this.isSamePosition(pos, { x: tile.position.x, y: tile.position.y })) {
                        moved = true;
                    }
                }

            });
        });

        if (!moved) return;
        this.addRandomTile();
        if (!this.checkIfCanContinue()) {
            this.gameStatus = 'gameOver';
            return;
        }



    } 

}