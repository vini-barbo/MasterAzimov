import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getArticlesSummary(query: string): Observable<any> {
    return this.http.get<any>(this.Url + '/search/summary', { params: { query: query, qtd: 5 } });
  }

}
