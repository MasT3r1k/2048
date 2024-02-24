export type TileStatus = 'idle' | 'appearing' | 'merging';
export type Direction = 'up' | 'down' | 'left' | 'right';

export type Tile = {
    x: number;
    y: number;
    num: number;
    status: TileStatus;
}
  
export type GameConfig = {
    gameWidth: number;
    tileMargin: number;
    tileCount: number;
  }
  
export type TileConfig = {
    background: string;
    color: string;
}