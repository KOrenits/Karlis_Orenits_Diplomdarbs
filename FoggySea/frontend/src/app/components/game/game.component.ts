import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
    gameId;
    nickname;
    tilesList;
    usersList;
    tile;
    isGameStarted: boolean = false;
    isHostUser: boolean = false;
    clickedTile;

  constructor(
    private socketIoService: SocketioService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    private sharedDataService: SharedDataService
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
        this.socketIoService.requestUsers(this.gameId);
        this.recieveJoinedPlayers();
        this.recieveStartGame();
        this.recieveGameUpdate();
  }

  nextGame() {
    this.socketIoService.startGame(this.gameId);
  }

  startGame() {
    this.isGameStarted = true;
    this.socketIoService.startGame(this.gameId);
  }
  
  clickTile(tile) {
    this.socketIoService.sendGameUpdate(this.gameId, this.tilesList, tile);
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((usersList) => {
      this.usersList = usersList;
      console.log(this.usersList);
      
      //this.isHostUser = usersList.find((user) => user.isHost)?.nickname === this.nickname;
    });
  }

  recieveStartGame() {
    this.socketIoService.recieveStartGame().subscribe((tilesList) => {
      this.tilesList = tilesList;
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveGameUpdate(this.gameId).subscribe((tilesList) => {
      this.tilesList = tilesList;
    });
  }  
}
