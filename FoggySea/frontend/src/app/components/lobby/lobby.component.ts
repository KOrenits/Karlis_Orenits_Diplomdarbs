import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private socketIoService: SocketioService
  ) {}

  ngOnInit(): void {}

  createGame() {
    const uuid = uuidv4();
    const nickname = (document.getElementById('nickname') as HTMLInputElement).value;

    this.sharedDataService.setNickname(nickname);
  this.sharedDataService.setGameId(uuid);
    
    this.router.navigate(['/game', uuid]);
  }

  joinGame() {
    const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
    const gameLinkInput = document.getElementById('gamelink') as HTMLInputElement;
  
    const gameId = gameLinkInput.value.trim().split('/').pop();
    console.log(gameId);
    if (!gameId) {
      // Game ID is empty
      alert('Please enter a game ID');
      return;
    }
  
    // Set the nickname and gameId in the shared data service
    this.sharedDataService.setNickname(nickname);
    this.sharedDataService.setGameId(gameId);
  
    // Connect to the socket
    this.socketIoService.connect(gameId, nickname);
  
    // Navigate to the game component with the game ID as a parameter
    this.router.navigate(['/game', gameId]);
  }
}
