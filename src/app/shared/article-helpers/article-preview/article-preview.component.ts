import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { ArticleMetaComponent } from '../article-meta/article-meta.component';
// import { FavoriteButtonComponent } from "../buttons/favorite-button.component";
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FavoriteButtonComponent } from '../../buttons/favorite-button.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.css'],
  imports: [
    ArticleMetaComponent,
    RouterLink,
    NgForOf,
    NgIf,
    MatCardModule,
    MatIconModule,
    DatePipe,
    FavoriteButtonComponent,
    MatChipsModule,
    MatDividerModule
  ],
  standalone: true,
})
export class ArticlePreviewComponent {
  @Input() article!: Article;

  constructor(private router: Router) {}

  navigateToLink(link: string): void {
    this.router.navigateByUrl(link);
  }
}
