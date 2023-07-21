import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { User } from "src/app/core/models/user.model";
import { Comment } from "src/app/core/models/comment.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-article-comment',
  standalone: true,
  imports: [RouterLink, DatePipe, NgIf, AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss']
})
export class ArticleCommentComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<boolean>();

  canModify$ = inject(UserService).currentUser.pipe(
    map(
      (userData: User | null) =>
        userData?.username === this.comment.author.username
    )
  );

}
