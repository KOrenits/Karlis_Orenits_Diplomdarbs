import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { GameRulesDialogComponent } from './components/game-rules-dialog/game-rules-dialog.component';
import { GameEndDialogComponent } from './components/game-end-dialog/game-end-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    GameComponent,
    GameRulesDialogComponent,
    GameEndDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
