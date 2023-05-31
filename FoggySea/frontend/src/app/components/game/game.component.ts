import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GameRulesDialogComponent } from '../game-rules-dialog/game-rules-dialog.component';
import { GameEndDialogComponent } from '../game-end-dialog/game-end-dialog.component';

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
    hostUser: any = {}; // a
    isHostUser: boolean = false;
    clickedTile;
    currentUser;
    pageUser;
    isGameOver: boolean = false;

  constructor(
    private socketIoService: SocketioService,
    private router: Router,
    private sharedDataService: SharedDataService,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.gameId = this.sharedDataService.getGameId();
    this.nickname = this.sharedDataService.getNickname();
    this.socketIoService.requestUsers(this.gameId);
    this.recieveJoinedPlayers();
    this.recieveStartGame();
    this.recieveGameUpdate();
  }


    @HostListener('window:popstate', ['$event'])
    handlePopState(event: Event) {
      event.preventDefault();
      this.leaveRoom(this.usersList.find(user => user.nickname === this.nickname));
    }

    @HostListener('window:unload', ['$event'])
    handleUnload() {
      this.leaveRoom(this.usersList.find(user => user.nickname === this.nickname));
    }
  
  clickTile(tile) {
   this.currentUser = this.usersList.find((user) => user.currentTurn);
    if (!this.currentUser || this.currentUser.nickname !== this.nickname) 
    {
      this.sharedDataService.openDialog('Šobrīd nav Jūsu kārta veikt gājienu');
      return;
    }
    this.socketIoService.gameUpdate(this.gameId, this.tilesList, tile, this.usersList, this.currentUser, this.isGameOver);
  }

  openGameEndDialog(usersList): void {
    this.usersList = usersList;
    this.matDialog.open(GameEndDialogComponent, {
      width: '600px',
      data: { usersList: this.usersList }
    });
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((usersList) => {
      this.usersList = usersList;
      this.pageUser = usersList.find((user) => user.nickname == this.nickname);
      this.hostUser = usersList.find((user) => user.isHost == true);
    });
  }

  startGame() {
   /*  if (this.usersList.length < 2) 
    {
      this.sharedDataService.openDialog('Lai uzsāktu spēli jābūt vismaz diviem dalībniekiem');
      return
    } */
    this.isGameOver = false;
    this.isGameStarted = true;
    this.socketIoService.startGame(this.gameId, this.isGameStarted);
    this.currentUser = this.usersList.find(user => user.playerId == 0);
    this.usersList.forEach(user=>{
      user.points = 0;
    })
  }

  recieveStartGame() {
    this.socketIoService.recieveStartGame().subscribe((data: { tilesList: any, isGameStarted: boolean}) => {
      this.tilesList = data.tilesList;
      this.isGameStarted = data.isGameStarted;
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveGameUpdate().subscribe((data: { tilesList: any, usersList: any, currentUser: any, isGameOver: boolean }) => {    
      this.tilesList = data.tilesList;
      this.usersList = data.usersList;
      this.currentUser = data.currentUser;
      this.isGameOver = data.isGameOver;
      if(this.isGameOver)
      {
        this.openGameEndDialog(this.usersList);
        this.isGameOver = true;
        this.isGameStarted = false;
      }
    });
  }

  leaveRoom(user){
    this.socketIoService.leaveRoom(this.usersList, user, this.gameId);
    this.router.navigate(['']);
  }

  openRules() {
    this.matDialog.open(GameRulesDialogComponent, {
      width: '1000px',
    });
  }
}
