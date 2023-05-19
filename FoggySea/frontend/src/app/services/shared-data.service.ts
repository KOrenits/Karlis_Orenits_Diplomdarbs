import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private readonly GAME_ID_KEY = 'gameId';
  private readonly NICKNAME_KEY = 'nickname';

  private GameId: string;
  private Nickname: string;

  constructor() {
    // Retrieve gameId and nickname from localStorage on initialization
    this.GameId = localStorage.getItem(this.GAME_ID_KEY);
    this.Nickname = localStorage.getItem(this.NICKNAME_KEY);
  }

  getGameId() {
    return this.GameId;
  }

  setGameId(gameId) {
    this.GameId = gameId;
    // Save gameId to localStorage
    localStorage.setItem(this.GAME_ID_KEY, gameId);
  }

  getNickname() {
    return this.Nickname;
  }

  setNickname(nickname) {
    this.Nickname = nickname;
    // Save nickname to localStorage
    localStorage.setItem(this.NICKNAME_KEY, nickname);
  }
}