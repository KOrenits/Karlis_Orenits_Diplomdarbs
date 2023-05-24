import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private readonly GAME_ID_KEY = 'gameId';
  private readonly NICKNAME_KEY = 'nickname';
  private readonly IS_GAME_STARTED_KEY = 'isGameStarted';

  private GameId: string;
  private Nickname: string;
  private UsersList: any[];
  private IsGameStarted: boolean = false;

  constructor() {
    // Retrieve gameId and nickname from localStorage on initialization
    this.GameId = localStorage.getItem(this.GAME_ID_KEY);
    this.Nickname = localStorage.getItem(this.NICKNAME_KEY);
    this.UsersList = JSON.parse(localStorage.getItem('usersList')) || [];
    this.IsGameStarted = JSON.parse(localStorage.getItem(this.IS_GAME_STARTED_KEY)) || false;
  }

  setIsGameStarted(isGameStarted: boolean) {
    this.IsGameStarted = isGameStarted;
    // Save isGameStarted to localStorage
    localStorage.setItem(this.IS_GAME_STARTED_KEY, JSON.stringify(isGameStarted));
  }

  getIsGameStarted() {
    const isGameStarted = localStorage.getItem(this.IS_GAME_STARTED_KEY);
    return isGameStarted ? JSON.parse(isGameStarted) : this.IsGameStarted;
  }

  setUsersList(usersList: any[]) {
    this.UsersList = usersList;
    // Save usersList to localStorage
    localStorage.setItem('usersList', JSON.stringify(usersList));
  }

  getUsersList() {
    return this.UsersList;
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