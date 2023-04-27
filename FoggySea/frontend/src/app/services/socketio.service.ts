import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  constructor() {}

  connect(gameId) {
    this.socket = io('http://localhost:3000')
    this.socket.emit('joinRoom', { gameId: gameId });
  }

  joinRoom(nickname, gameId) {
    this.socket.emit('joinRoom', { nickname: nickname, gameId: gameId });
  }

  startGame(gameId) {
    this.socket.emit('startGame', { gameId: gameId });
  }

  sendGameUpdate(gameId, tilesList, clickedTile) {
    this.socket.emit('gameUpdate', { gameId: gameId, tilesList: tilesList, clickedTile: clickedTile });
    tilesList = tilesList;
  }

  recieveJoinedPlayers() {
    return new Observable((observer) => {
      this.socket.on('joinGame', (message) => {
        observer.next(message);
      });
    });
  }

  recieveStartGame() {
    return new Observable((observer) => {
      this.socket.on('startGame', (tilesList) => {
        observer.next(tilesList);
      });
    });
  }

  recieveGameUpdate(gameId) {
    return new Observable((observer) => {
      this.socket.on(gameId, (tilesList) => {
        observer.next(tilesList);
      });
    });
  }
}
