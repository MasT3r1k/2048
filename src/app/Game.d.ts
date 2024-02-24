export type Tile = {
    x: number;
    y: number;
    num: number;
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