import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-end-dialog',
  templateUrl: './game-end-dialog.component.html',
  styleUrls: ['./game-end-dialog.component.css']
})
export class GameEndDialogComponent {
  usersList: any[]; // Define a property to hold the usersList data
  topPlace: any[];
  highestPoints = 0;
  highestPointsUser;

  constructor(
    public dialogRef: MatDialogRef<GameEndDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 

  {
    this.usersList = data.usersList;

    this.usersList.forEach(user => {
      if (user.points >= this.highestPoints) {
        this.highestPoints = user.points;
        this.highestPointsUser = user;
      }
    });
  }
}