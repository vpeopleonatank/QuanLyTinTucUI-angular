import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Topic } from '../models/topic.model';
import { TopicListConfig } from '../models/topic-list-config.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TopicService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: TopicListConfig
  ): Observable<{ topics: Topic[] }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<{ topics: Topic[] }>(
      '/topic' ,
      { params }
    );
  }

  create(topic: Partial<Topic>): Observable<Topic> {
    return this.http
      .post<Topic>('/topic/', { TopicName: topic.topicName});
  }

  update(topic: Partial<Topic>): Observable<Topic> {
    return this.http.put<Topic>(`/topic/${topic.topicId}`, topic);
  }

  delete(topicId: number): Observable<void> {
    return this.http
      .delete<void>(`/topic/${topicId}`);
  }
}
