import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Game2048, TileConfig } from './Game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '2048';

  constructor(
    public Game: Game2048
  ) {}

  public tileTypes: TileConfig[] = [
    { background: '#c1b3a4', color: 'transparent' },// 0
    { background: '#eee4da', color: '#776e65' },    // 2
    { background: '#ede0c8', color: '#776e65' },    // 4
    { background: '#f2b179', color: '#f9f6f2' },    // 8
    { background: '#f59563', color: '#f9f6f2' },    // 16
    { background: '#f67c5f', color: '#f9f6f2' },    // 32
    { background: '#f65e3b', color: '#f9f6f2' },    // 64
    { background: '#edcf72', color: '#f9f6f2' },    // 128
    { background: '#edcc61', color: '#f9f6f2' },    // 256
    { background: '#edc850', color: '#f9f6f2' },    // 512
    { background: '#edc53f', color: '#f9f6f2' },    // 1024
    { background: '#edc22e', color: '#f9f6f2' },    // 2048
  ];


  // ngOnInit(): void {

  //   this.generateTile(2);

  //   this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
  //     if (!event.key) return;
  //     switch(event.key) {
  //       case "ArrowUp":
  //         this.getUsedTiles().forEach((tile: Tile) => {
  //           console.log(tile)
  //           if (tile.y === 0) return;
  //           let y = tile.y;
  //           for(let i = 1;i <= y;i++) {
  //             if (tile.y - i < 0) return;
  //             let upperTile = this.getTileByCoordinates(tile.x, tile.y - i);
  //             if (upperTile.num === 0) {
  //               upperTile.num = tile.num;
  //               tile.num = 0;
  //               tile = upperTile;
  //             }
  //           }
  //         })
  //         break;
  //       case "ArrowDown":
  //         this.getUsedTiles().forEach((tile: Tile) => {
  //           console.log(tile)
  //           if (tile.y === this.config.tileCount - 1) return;
  //           let y = tile.y;

  //           for(let i = this.config.tileCount - 1;i > y;i--) {

  //             if (tile.y + i > this.config.tileCount - 1) return;
              
  //             let downTile = this.getTileByCoordinates(tile.x, tile.y + i);
              
  //             if (downTile.num === 0) {
  //               downTile.num = tile.num;
  //               tile.num = 0;
  //               tile = downTile;
  //             }
  //           }
  //         })
  //         break;
  //       default:
  //         console.log(event.key);
  //         break;
  //     }
  //   });

  // }



  public getMath(): Math {
    return Math;
  }


}
