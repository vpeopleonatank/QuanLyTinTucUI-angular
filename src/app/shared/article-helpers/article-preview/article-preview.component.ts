import { Component, Input, OnInit } from '@angular/core';
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
import { ImageService } from 'src/app/core/services/image.service';

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
    MatDividerModule,
    NgIf
  ],
  standalone: true,
})
export class ArticlePreviewComponent implements OnInit {
  @Input() article!: Article;
  preview: string = '';

  constructor(
    private router: Router,
    private readonly imageService: ImageService
  ) {}

  ngOnInit() {
    if (this.article) {
      this.imageService
        .getImgFromUrl(this.article.bannerImage)
        .subscribe((response: Blob) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.preview = e.target.result;
          };
          reader.readAsDataURL(response);
        });
    }
  }

  navigateToLink(link: string): void {
    this.router.navigateByUrl(link);
  }
}
