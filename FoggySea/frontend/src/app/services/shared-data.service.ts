import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private readonly GAME_ID_KEY = 'gameId';
  private readonly NICKNAME_KEY = 'nickname';
  private readonly USERS_LIST_COUNT_KEY = "usersListCount"

  private GameId: string;
  private Nickname: string;
  private UsersListCount;

  constructor() {
    // Retrieve gameId and nickname from localStorage on initialization
    this.GameId = localStorage.getItem(this.GAME_ID_KEY);
    this.Nickname = localStorage.getItem(this.NICKNAME_KEY);
    this.UsersListCount = parseInt(localStorage.getItem(this.USERS_LIST_COUNT_KEY));
  }

  getUsersListCount() {
    return this.UsersListCount;
  }

  setUsersListCount(usersListCount) {
    this.UsersListCount = usersListCount;
    // Save gameId to localStorage
    localStorage.setItem(this.USERS_LIST_COUNT_KEY, String(usersListCount));
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