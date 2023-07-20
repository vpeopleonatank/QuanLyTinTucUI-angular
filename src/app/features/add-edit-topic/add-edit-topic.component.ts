import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Topic } from 'src/app/core/models/topic.model';
import { TopicService } from 'src/app/core/services/topic.service';

@Component({
  selector: 'app-add-edit-topic',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-edit-topic.component.html',
  styleUrls: ['./add-edit-topic.component.scss']
})
export class AddEditTopicComponent implements OnInit {

  topicForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddEditTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Topic,
    private topicService: TopicService
  ) {
    this.topicForm = this._fb.group({
      topicId: '',
      topicName: '',
    });
  }

  ngOnInit(): void {
    this.topicForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.topicForm.valid) {
      if (this.data) {
        this.topicService.update(this.topicForm.value).subscribe({
          next: (_) => {
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err);
          }
        })

      } else {
        this.topicService.create(this.topicForm.value).subscribe({
          next: (_) => {
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }
    }
  }
}
