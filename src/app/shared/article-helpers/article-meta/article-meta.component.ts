import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html',
  styleUrls: ['./article-meta.component.css'],
  imports: [RouterLink, DatePipe, NgIf, MatCardModule, MatIconModule],
  standalone: true,
})
export class ArticleMetaComponent {
  @Input() article!: Article;
}
