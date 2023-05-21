import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private socketIoService: SocketioService,
    private matsnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  createGame() {
    const uuid = uuidv4();
    const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
    if (!nickname) {
      // Game ID is empty
      this.matsnackBar.open('Please enter a nickname', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

  this.sharedDataService.setNickname(nickname);
  this.sharedDataService.setGameId(uuid);
    
    this.router.navigate(['/game', uuid]);
  }

  joinGame() {
    const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
    const gameLinkInput = document.getElementById('gamelink') as HTMLInputElement;
  
    const gameId = gameLinkInput.value.trim().split('/').pop();

    if (!nickname) {
      // NickName is empty
      this.matsnackBar.open('Please enter a nickname', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }


    if (!gameId) {
      // Game ID is empty
      this.matsnackBar.open('Please enter a game ID', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

  var usersCount = this.sharedDataService.getUsersListCount();
  if (usersCount > 6) {
    // Maximum user count reached
    this.matsnackBar.open('Cannot join the room, maximum users reached', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    return;
  }
  
    // Set the nickname and gameId in the shared data service
    this.sharedDataService.setUsersListCount(usersCount + 1);
    this.sharedDataService.setNickname(nickname);
    this.sharedDataService.setGameId(gameId);
  
    // Connect to the socket
    this.socketIoService.connect(gameId, nickname);
  
    // Navigate to the game component with the game ID as a parameter
    this.router.navigate(['/game', gameId]);
  }
}
