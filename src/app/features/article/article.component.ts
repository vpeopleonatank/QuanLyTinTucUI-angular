import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
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

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MarkdownPipe,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: Article;
  currentUser!: User | null;
  canModify: boolean = false;

  isSubmitting = false;
  isDeleting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesService,
    // private readonly commentsService: CommentsService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  navigateToLink(link: string): void {
    this.router.navigateByUrl(link);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    combineLatest([
      this.articleService.get(slug),
      // this.commentsService.getAll(slug),
      this.userService.currentUser,
    ])
      .pipe(
        catchError((err) => {
          void this.router.navigate(['/']);
          return throwError(err);
        })
      )
      .subscribe(([article, currentUser]) => {
        this.article = article;
        // this.comments = comments;
        this.currentUser = currentUser;
        // this.canModify = currentUser?.username === article.author.username;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
