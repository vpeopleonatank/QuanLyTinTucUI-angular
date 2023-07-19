import { Component } from '@angular/core';
import { ArticleListConfig } from '../../core/models/article-list-config.model';
import { ArticleListComponent } from 'src/app/shared/article-helpers/article-list/article-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ArticleListComponent],
  standalone: true,
})
export class HomeComponent {
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {},
  };
}
