import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {

  isDarkTheme = false;
  lastDialogResult: string;

  foods: any[] = [
    {name: 'Pizza', rating: 'Excellent'},
    {name: 'Burritos', rating: 'Great'},
    {name: 'French fries', rating: 'Pretty good'},
  ];

  progress = 0;

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar) {

    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);

  }

  openDialog() {
    const dialogRef = this._dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
  });

  }

  ngOnInit() {
  }

}

@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a text box inside of a dialog.
        <input #dialogInput>
      </label>
    </p>
    <p> <button mat-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})
export class DialogContentComponent {
  constructor(@Optional() public dialogRef: MatDialogRef<DialogContentComponent>) {

  }
}
