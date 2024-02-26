import { TileCeil, TileInfo, TileOrNull, TilePosition, TileConfig } from "./Tile.d";

export const tileTypes: TileConfig[] = [
    { num: 0,    background: '#c1b3a4', color: 'transparent' },
    { num: 2,    background: '#eee4da', color: '#776e65' },
    { num: 4,    background: '#ede0c8', color: '#776e65' },
    { num: 8,    background: '#f2b179', color: '#f9f6f2' },
    { num: 16,   background: '#f59563', color: '#f9f6f2' },
    { num: 32,   background: '#f67c5f', color: '#f9f6f2' },
    { num: 64,   background: '#f65e3b', color: '#f9f6f2' },
    { num: 128,  background: '#edcf72', color: '#f9f6f2' },
    { num: 256,  background: '#edcc61', color: '#f9f6f2' },
    { num: 512,  background: '#edc850', color: '#f9f6f2' },
    { num: 1024, background: '#edc53f', color: '#f9f6f2' },
    { num: 2048, background: '#edc22e', color: '#f9f6f2' },
];

export function getTileType(num: number): TileConfig {
    let tile = tileTypes.filter((tile: TileConfig) => tile.num === num);
    return tile.length > 0 ? tile[0] : tileTypes[0];
}

export class Tile {
    public declare position: TilePosition;
    public value: number = 2;

    public merged: [Tile, Tile] | null = null;
    public appearing: boolean = true;

    constructor(position: TilePosition, value: number = 2) {
        this.position = position;
        this.value = value || 2;
        setTimeout(() => {
            this.appearing = false;
        }, 300);
    }

    public updatePos(position: TilePosition): void {
        this.position = position;
    }

    public getInfo(): TileInfo {
        return {
            x: this.position.x,
            y: this.position.y,
            num: this.value
        }
    }
}

export type { TilePosition, TileInfo, TileCeil, TileOrNull, TileConfig }