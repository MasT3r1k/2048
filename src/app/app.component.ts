import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { Game2048 as oldgame } from './Game';
import { Direction, Game2048 as newgame } from './Game/Game_Manager';
import { Grid } from './Game/Grid';
import { Tile, getTileType, TilePosition } from './Game/Tile';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = '2048';

  getTileType = getTileType;

  declare newGame: newgame;
  constructor(
    // public Game: oldgame, 
    private changeDetectorRef: ChangeDetectorRef
    
  ) {
    this.newGame = new newgame(4, 2048, new Grid(4), changeDetectorRef);
  }

  ngOnInit(): void {
    fromEvent(window, 'keydown').pipe().subscribe((event: any) => {
      if (!event.key) return;
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          let direction = (event.key as string).slice(5).toLowerCase() as Direction;
          this.newGame.moveEvent(direction);
          break;

      }
    })
  }

  public getTilePosition(tile: Tile): TilePosition {
    
    let pos: TilePosition = { 
      x: tile.position.x,
      y: tile.position.y
    };

    
    return {
      x: this.newGame.getGameMargin() * (pos.x + 1) + this.getMath().floor(pos.x) * this.newGame.getTileSize(),
      y: this.newGame.getGameMargin() * (this.getMath().floor(pos.y) + 1) + this.getMath().floor(pos.y) * this.newGame.getTileSize()
    };

  }

  public TilePositionFormat(pos: TilePosition): string {
    return pos.x + 'px ' + pos.y + 'px';
  }


  public getMath(): Math {
    return Math;
  }


}
