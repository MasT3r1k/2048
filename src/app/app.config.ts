import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { Game2048 } from './Game/Game_Manager';
import { GameStorage } from './Game/Storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), Game2048, GameStorage]
};
