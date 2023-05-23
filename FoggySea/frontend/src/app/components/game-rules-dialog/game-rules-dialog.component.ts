import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-rules-dialog',
  templateUrl: './game-rules-dialog.component.html',
  styleUrls: ['./game-rules-dialog.component.css']
})
export class GameRulesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GameRulesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}