import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MatDialog } from '@angular/material/dialog';
import { GameRulesDialogComponent } from '../game-rules-dialog/game-rules-dialog.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {

  usersList;
  nickname;
  gameId;
  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private socketIoService: SocketioService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.socketIoService.connect();
    this.recieveJoinedPlayers();
  }

  createGame() {
    this.gameId = uuidv4();
    this.nickname = (document.getElementById('nickname') as HTMLInputElement).value;
    if(this.nickNameValidation(this.nickname))
    {
      this.socketIoService.joinRoom(this.gameId, this.nickname);
      this.sharedDataService.setNickname(this.nickname);
      this.sharedDataService.setGameId(this.gameId);
      this.router.navigate(['/game', this.gameId]);
    }
  }

  joinGame() {
    this.nickname = (document.getElementById('nickname') as HTMLInputElement).value;
    const gameLinkInput = document.getElementById('gamelink') as HTMLInputElement;
    this.gameId = gameLinkInput.value.trim().split('/').pop();
    if(!this.gameIdValidation(this.gameId))
    {
      return
    }
    if(!this.nickNameValidation(this.nickname))
    {
      return;
    }
    var doOneTime = true;
    this.socketIoService.joinRoom(this.gameId, this.nickname);
    this.socketIoService.recieveJoinedPlayers().subscribe((usersList) => {
      if(doOneTime)
      {
        doOneTime = false;
        if (usersList.length > 6) {
          this.sharedDataService.openDialog('Nevar pievienoties istabai, jo ir sasniegts maksimālais spelētāju skaits');
          this.leaveRoom(usersList[usersList.length - 1]);

          return;
        }
        else
        {
          const duplicateUser = usersList.filter((user) => user.nickname === this.nickname);
          if (duplicateUser.length>1) {
            this.sharedDataService.openDialog('Šajā istabā jau ir lietotājs ar šādu segvārdu');
            this.leaveRoom(duplicateUser[1]);

            return;
          }
          else
          {
            this.sharedDataService.setNickname(this.nickname);
            this.sharedDataService.setGameId(this.gameId);
            this.router.navigate(['/game', this.gameId]);
          }
        }
      }
    });
  }


  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((usersList) => {
      this.usersList = usersList;
    });
  }

  nickNameValidation(nickname)
  {
    if (!nickname) {
      this.sharedDataService.openDialog('Lūdzu ievadiet segvārdu');

      return false;
    }
    const nicknameLength = nickname.trim().length;
    if (nicknameLength <3 || nicknameLength > 8) {
      this.sharedDataService.openDialog('segvārdam jābūt 3-8 simbolus garam');

      return false;
    }
    return true;
  }

  gameIdValidation(gameId)
  {
    if (!gameId) {
      this.sharedDataService.openDialog('Lūdzu ievadiet spēles ID');

      return false;
    }
    const nicknameLength = this.gameId.trim().length;
    if (nicknameLength != 36) {
      this.sharedDataService.openDialog('ID ir ievadīts nepareizi');

      return false;
    }
    return true;
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