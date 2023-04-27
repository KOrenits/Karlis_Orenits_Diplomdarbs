import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
    gameId: string;
    tilesList;
    tile;
    isGameStarted: boolean = false;
    clickedTile;

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
    console.log(this.tilesList);
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
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveGameUpdate(this.gameId).subscribe((tilesList) => {
      this.tilesList = tilesList;
      console.log(this.tilesList)
    });
  } 
  
}
