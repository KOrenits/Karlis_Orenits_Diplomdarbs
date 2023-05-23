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
  isGameStarted;

  constructor() {}

  connect(gameId, nickname) {
    this.socket = io('http://localhost:3000')
    this.socket.emit('joinRoom', {nickname: nickname, gameId: gameId });
  }


  gameUpdate(gameId, tilesList, clickedTile, usersList, currentUser, isGameOver) {
    this.socket.emit('gameUpdate', { 
      gameId: gameId, 
      tilesList: tilesList, 
      clickedTile: clickedTile, 
      usersList: usersList, 
      currentUser: currentUser,
      isGameOver: isGameOver 
    });
  }

  recieveJoinedPlayers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('users', (usersList) => {
        observer.next(usersList);
      });
    });
  }

  startGame(gameId, isGameStarted) {
    this.socket.emit('startGame', { gameId: gameId, isGameStarted: isGameStarted });
  }

recieveStartGame() {
  return new Observable((observer) => {
    this.socket.on('startGame', ({ tilesList, isGameStarted }) => {
      observer.next({ tilesList, isGameStarted });
    });
  });
}

recieveGameUpdate(gameId) {
  return new Observable((observer) => {
    this.socket.on(gameId, ({ tilesList, usersList, currentUser, isGameOver }) => {
      observer.next({ tilesList, usersList, currentUser, isGameOver });
    });
  });
}

  requestUsers(gameId: string): void {
    this.socket.emit('requestUsers', { gameId });
  }

  leaveRoom(usersList, leavingUser,gameId)
  {
    this.socket.emit('leave', {usersList: usersList, leavingUser: leavingUser, gameId: gameId});
  }
}
