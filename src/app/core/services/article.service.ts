import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleListConfig } from '../models/article-list-config.model';
import { Article } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<{ articles: Article[]; articlesCount: number }>(
      '/articles',
      { params }
    );
  }

  get(slug: string): Observable<Article> {
    return this.http
      .get<{ article: Article }>(`/articles/${slug}`)
      .pipe(map((data) => data.article));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<Article>): Observable<Article> {
    let formData: FormData = new FormData();
    formData.append('Article.title', article.title!);
    formData.append('Article.description', article.description!);
    formData.append('Article.topicId', article.topicId?.toString()!);
    formData.append('Article.body', article.body!);
    formData.append('Article.bannerImage', article.bannerImage!);
    for (let i = 0; i < article.tagList!.length; i++) {
      formData.append('Article.tagList', article.tagList![i]);
    }
    
    return this.http
      .post<{ article: Article }>('/articles/', formData)
      .pipe(map((data) => data.article));
  }

  update(slug: string, article: Partial<Article>): Observable<Article> {
    let formData: FormData = new FormData();
    formData.append('Article.title', article.title!);
    formData.append('Article.description', article.description!);
    formData.append('Article.topicId', article.topicId?.toString()!);
    formData.append('Article.body', article.body!);
    formData.append('Article.bannerImage', article.bannerImage!);
    for (let i = 0; i < article.tagList!.length; i++) {
      formData.append('Article.tagList', article.tagList![i]);
    }
    formData.append('slug', slug);
    return this.http
      .put<{ article: Article }>(`/articles/`, formData)
      .pipe(map((data) => data.article));
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
