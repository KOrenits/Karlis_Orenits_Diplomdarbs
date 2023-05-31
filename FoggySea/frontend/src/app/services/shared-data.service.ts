import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private readonly GAME_ID_KEY = 'gameId';
  private readonly NICKNAME_KEY = 'nickname';

  private gameId: string;
  private nickname: string;

  constructor(
    private matSnackbar: MatSnackBar,
    ){
    this.gameId = localStorage.getItem(this.GAME_ID_KEY);
    this.nickname = localStorage.getItem(this.NICKNAME_KEY);
  }

  getGameId() {
    return this.gameId;
  }

  setGameId(gameId: string) {
    this.gameId = gameId;
    // Save gameId to localStorage
    localStorage.setItem(this.GAME_ID_KEY, gameId);
  }

  getNickname() {
    return this.nickname;
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
    // Save nickname to localStorage
    localStorage.setItem(this.NICKNAME_KEY, nickname);
  }

  openDialog(message)
  {
    this.matSnackbar.open(message, 'Aizvērt', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    return;
  }
}
