import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  template: `
    <div *ngIf="!joined">
      <h1>Enter your nickname and room name</h1>
      <input type="text" [(ngModel)]="nickname" placeholder="Enter your nickname" />
      <br /><br />
      <input type="text" [(ngModel)]="room" placeholder="Enter the room name" />
      <br /><br />
      <button (click)="joinRoom()">Join</button>
    </div>

    <div *ngIf="joined">
      <h1>Users in room {{ room }}</h1>
      <ul>
        <li *ngFor="let user of users">{{ user }}</li>
      </ul>
    </div>
  `,
})
export class GameComponent implements OnInit {
    gameId: string;
    tilesList;
    tile;
    isGameStarted: boolean = false;
    clickedTile;


  nickname: string;
  room: string;
  joined: boolean = false;
  users: any[] = [];


  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.socketIoService.connect(this.gameId);
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
    console.log()
  }

  clickTile(tile) {
    this.socketIoService.sendGameUpdate(this.gameId, this.tilesList, tile);
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((message: string) => {
      this.snackbar.open(message, '', {
        duration: 3000,
      });
    });
  }

  recieveStartGame() {
    this.socketIoService.recieveStartGame().subscribe((tilesList) => {
      this.tilesList = tilesList;
      console.log(this.tilesList);
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveGameUpdate(this.gameId).subscribe((tilesList) => {
      this.tilesList = tilesList;
      console.log(this.tilesList)
    });
  } 
  
  joinRoom() {
    this.socketIoService.joinRoom(this.nickname, this.gameId);
    this.joined = true;
  }
}
