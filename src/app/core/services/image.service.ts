import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private httpClient: HttpClient;
  constructor(private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  getImgFromUrl(url: string) {
    return this.httpClient.get('http://localhost:5199/' + url, {
      responseType: 'blob',
    });
  }
}
