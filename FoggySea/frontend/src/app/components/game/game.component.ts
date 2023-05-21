import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
    gameId;
    nickname;
    tilesList;
    usersList = [];
    tile;
    isGameStarted: boolean = false;
    isHostUser: boolean = false;
    clickedTile;
    currentUser;

  constructor(
    private socketIoService: SocketioService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    private sharedDataService: SharedDataService,
    private materialModule: MaterialModule,
  ) {}

  ngOnInit(): void {
        /* this.activatedRoute.queryParams.subscribe((params) => {
          this.clearNickname(); 
          this.nickname = params['nickname'];
          this.gameId = params['gameId'];
          this.socketIoService.connect(this.nickname, this.gameId, );
          this.socketIoService.requestUsers(this.gameId);
          this.recieveJoinedPlayers();
          this.recieveStartGame();
          this.recieveGameUpdate();
        });  */
        this.gameId = this.sharedDataService.getGameId();
        this.nickname = this.sharedDataService.getNickname(); 

        this.socketIoService.connect(this.gameId, this.nickname);

        //this.socketIoService.requestUsers(this.gameId);
        this.recieveJoinedPlayers();
        this.recieveStartGame();
        this.recieveGameUpdate();
  }

  
  clickTile(tile) {
    const currentUser = this.usersList.find((user) => user.currentTurn);
  
    if (!currentUser || currentUser.nickname !== this.nickname) {
      this.snackbar.open('It is not your turn to click the tile.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }
  
    // Only the current user can send the game update
    this.socketIoService.sendGameUpdate(this.gameId, this.tilesList, tile, this.usersList, currentUser);
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((usersList) => {
      this.usersList = usersList;
     
      this.isHostUser = usersList.find((user) => user.isHost)?.nickname === this.nickname;
    });
  }

  startGame() {
    if (this.usersList.length < 2) {
      this.snackbar.open('Need at least 2 players to start the game', 'Close', {
        duration: 5000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }
    this.socketIoService.startGame(this.gameId, this.isGameStarted);
    this.currentUser = this.usersList.find(user => user.playerId == 0);
    
  }

  recieveStartGame() {
  this.socketIoService.recieveStartGame().subscribe((data: { tilesList: any, isGameStarted: any }) => {
    this.tilesList = data.tilesList;
    this.isGameStarted = data.isGameStarted;
  });
}

recieveGameUpdate() {
  this.socketIoService.recieveGameUpdate(this.gameId).subscribe((data: { tilesList: any, usersList: any, currentUser: any }) => {
    this.tilesList = data.tilesList;
    this.usersList = data.usersList;
    this.currentUser = data.currentUser;
  });
}
}
