import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Comment } from '../../core/models/comment.model';
import { Article } from '../../core/models/article.model';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest, throwError } from 'rxjs';
import { ArticlesService } from '../../core/services/article.service';
// import { CommentsService } from "../../core/services/comment.service";
import { UserService } from '../../core/services/user.service';
import { MarkdownPipe } from './markdown.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Errors } from 'src/app/core/models/errors.model';
import { CommentsService } from 'src/app/core/services/comments.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowAuthedDirective } from 'src/app/shared/show-authed.directive';
import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { Role } from 'src/app/core/models/role.model';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MarkdownPipe,
    RouterLink,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    ShowAuthedDirective,
    ArticleCommentComponent,
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: Article;
  currentUser!: User | null;
  comments: Comment[] = [];
  canModify: boolean = false;

  isSubmitting = false;
  isDeleting = false;
  destroy$ = new Subject<void>();

  commentControl = new FormControl<string>('', { nonNullable: true });
  commentFormErrors: Errors | null = null;
  adminRoles: string[] = [Role.Admin, Role.Writer];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesService,
    // private readonly commentsService: CommentsService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly commentsService: CommentsService
  ) {}

  navigateToLink(link: string): void {
    this.router.navigateByUrl(link);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    combineLatest([
      this.articleService.get(slug),
      this.commentsService.getAll(slug),
      this.userService.currentUser,
    ])
      .pipe(
        catchError((err) => {
          void this.router.navigate(['/']);
          return throwError(err);
        })
      )
      .subscribe(([article, comments, currentUser]) => {
        this.article = article;
        this.comments = comments;
        this.currentUser = currentUser;
        // if (article.author) {
        //   this.canModify = currentUser?.username === article.author.username;
        // }
        if (currentUser && this.adminRoles.includes(currentUser.role)) {
          this.canModify = true;
        }
      });

    const user = this.userService.userValue;
    console.log(user);
  }

  deleteArticle(): void {
    this.isDeleting = true;

    this.articleService
      .delete(this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.router.navigate(['/']);
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = null;

    this.commentsService
      .add(this.article.slug, this.commentControl.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.commentControl.reset('');
          this.isSubmitting = false;
        },
        error: (errors) => {
          this.isSubmitting = false;
          this.commentFormErrors = errors;
        },
      });
  }

  deleteComment(comment: Comment): void {
    this.commentsService
      .delete(comment.id, this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.comments = this.comments.filter((item) => item !== comment);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById(index: number, item: Comment): string {
    return item.id;
  }
}
