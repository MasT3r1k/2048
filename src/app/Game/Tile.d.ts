export type TileStatus = 'idle' | 'appearing' | 'merging';

export type TilePosition = {
    x: number;
    y: number;
}

export type TileConfig = {
    num: number;
    background: string;
    color: string;
}

export type TileInfo = TilePosition & {
    num: number;
}

export type TileCeil = TilePosition & { tile: TileOrNull };
export type TileOrNull = Tile | null;