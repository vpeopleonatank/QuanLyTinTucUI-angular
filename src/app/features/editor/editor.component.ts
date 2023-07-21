import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListErrorsComponent } from '../../shared/list-errors.component';
import { NgForOf } from '@angular/common';
import { ArticlesService } from '../../core/services/article.service';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { Errors } from '../../core/models/errors.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Topic } from 'src/app/core/models/topic.model';
import { TopicService } from 'src/app/core/services/topic.service';
import { TopicListConfig } from 'src/app/core/models/topic-list-config.model';
import { MatSelectModule } from '@angular/material/select';

interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
  topicId: FormControl<number>;
}

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  imports: [
    ListErrorsComponent,
    ReactiveFormsModule,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatSelectModule,
  ],
  standalone: true,
})
export class EditorComponent implements OnInit, OnDestroy {
  tagList: string[] = [];
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    topicId: new FormControl(1, { nonNullable: true }),
    body: new FormControl('', { nonNullable: true }),
  });
  tagField = new FormControl<string>('', { nonNullable: true });

  errors: Errors | null = null;
  isSubmitting = false;
  destroy$ = new Subject<void>();
  topics: Topic[] = [];
  listConfig: TopicListConfig = {
    type: 'all',
    filters: {},
  };
  slug: string = '';

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

  ngOnInit() {
    this.topicService.query(this.listConfig).subscribe({
      next: (topics) => (this.topics = topics.topics),
    });
    this.slug = this.route.snapshot.params['slug'];
    if (this.slug === undefined) {
      return;
    }
    combineLatest([
      this.articleService.get(this.route.snapshot.params['slug']),
      this.userService.getCurrentUser(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([article, { user }]) => {
          // if (article.author && user.username === article.author.username) {
          this.tagList = article.tagList;
          this.articleForm.patchValue(article);
          // } else {
          //   void this.router.navigate(['/']);
          // }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (tag != null && tag.trim() !== '' && this.tagList.indexOf(tag) < 0) {
      this.tagList.push(tag);
    }
    // clear the input
    this.tagField.reset('');
  }

  removeTag(tagName: string): void {
    this.tagList = this.tagList.filter((tag) => tag !== tagName);
  }

  submitForm(): void {
    this.isSubmitting = true;

    // update any single tag
    this.addTag();

    if (this.slug) {
      this.articleService
        .update(this.slug, {
          ...this.articleForm.value,
          tagList: this.tagList,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (article) => this.router.navigate(['/article/', article.slug]),
          error: (err) => {
            this.errors = err.error;
            this.isSubmitting = false;
          },
        });
    } else {
      // post the changes
      this.articleService
        .create({
          ...this.articleForm.value,
          tagList: this.tagList,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (article) => this.router.navigate(['/article/', article.slug]),
          error: (err) => {
            this.errors = err.error;
            this.isSubmitting = false;
          },
        });
    }
  }
}
