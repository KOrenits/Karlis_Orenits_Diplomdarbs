import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MaterialModule } from 'src/app/material/material.module';
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
    hostUser: any = {}; // 
    isHostUser: boolean = false;
    clickedTile;
    currentUser;
    pageUser;
    isGameOver: boolean = false;

  constructor(
    private socketIoService: SocketioService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    private sharedDataService: SharedDataService,
    private materialModule: MaterialModule,
    private matDialog: MatDialog,
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
          //this.recieveCurrentState();
          //this.currentStateUpdate(this.gameId);
          if(this.isGameStarted)
          {
            this.isGameStarted = this.isGameStarted;
          } 
  }


      @HostListener('window:popstate', ['$event'])
    handlePopState(event: Event) {
      event.preventDefault();
      this.leaveRoom(this.usersList.find(user => user.nickname === this.nickname));
    }

    @HostListener('window:unload', ['$event'])
    handleUnload(event: Event) {
      // Save relevant data to restore the user's session when they return
      this.leaveRoom(this.usersList.find(user => user.nickname === this.nickname));
    }
  
  clickTile(tile) {
   this.currentUser = this.usersList.find((user) => user.currentTurn);
  
    if (!this.currentUser || this.currentUser.nickname !== this.nickname) {
      this.snackbar.open('Šobrīd nav Jūsu kārta veikt gājienu', 'Aizvērt', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }
  
    // Only the current user can send the game update
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
      this.sharedDataService.setUsersList(this.usersList);
    });
  }

  startGame() {
    if (this.usersList.length < 1) {
      this.snackbar.open('Lai uzsāktu spēli jābūt vismaz diviem dalībniekiem', 'Aizvērt', {
        duration: 3000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }
    this.isGameStarted = true;
    this.socketIoService.startGame(this.gameId, this.isGameStarted);
    this.currentUser = this.usersList.find(user => user.playerId == 0);
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
      //this.recieveJoinedPlayers();
      this.openGameEndDialog(this.usersList);
      this.isGameOver = false;
      this.isGameStarted = false;
      this.usersList.forEach(user=>{
        user.points = 0;
      })
    }
  });
}

leaveRoom(user){
  console.log(user);
   // Emit the "leave" event to the server
   this.socketIoService.leaveRoom(this.usersList, user, this.gameId);
   //this.recieveJoinedPlayers();
   this.router.navigate(['']);
}

  openRules() {
    this.matDialog.open(GameRulesDialogComponent, {
      width: '1000px', // Set the width of the dialog
      // Add any other configuration options as needed
    });
  }

  recieveCurrentState(){
    this.socketIoService.recieveCurrentState().subscribe((data: {isGameStarted: boolean}) => {      
      this.isGameStarted = data.isGameStarted[0];
    });
  }

  currentStateUpdate(gameId) {
    this.socketIoService.currentStateUpdate(gameId);
  }
}
