import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-topic',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-topic.component.html',
  styleUrls: ['./delete-topic.component.scss']
})
export class DeleteTopicComponent {

  constructor(
    private _dialogRef: MatDialogRef<DeleteTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public topicId: number,
  ) {}
}
