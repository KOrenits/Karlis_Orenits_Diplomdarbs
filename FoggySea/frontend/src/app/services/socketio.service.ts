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

  connect() {
    const host = window.location.hostname;
    this.socket = io(`http://${host}:3000`);
  }

  joinRoom(gameId,nickname)
  {
    this.socket.emit('joinRoom', {nickname: nickname, gameId: gameId });
  }

  gameUpdate(gameId, tilesList, clickedTile, usersList, currentUser, isGameStarted) {
    this.socket.emit('gameUpdate', { 
      gameId: gameId, 
      tilesList: tilesList, 
      clickedTile: clickedTile, 
      usersList: usersList, 
      currentUser: currentUser,
      isGameStarted: isGameStarted
    });
  }

  recieveJoinedPlayers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('users', (usersList) => {
        if (usersList !== null) {
          observer.next(usersList);
        }
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

recieveGameUpdate() {
  return new Observable((observer) => {
    this.socket.on('gameUpdate', ({ tilesList, usersList, currentUser, isGameOver }) => {
      observer.next({ tilesList, usersList, currentUser,  isGameOver });
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

  recieveCurrentState(){
    return new Observable((observer) => {
      this.socket.on('currentState', ({ isGameStarted }) => {
        if (isGameStarted != undefined) {
          observer.next({ isGameStarted });
        }
      });
    });
  }
  
  currentStateUpdate(gameId) {
    this.socket.emit('currentState', {gameId});
  }

}
