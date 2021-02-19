import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

export function getPaginatedResult<T>(http: HttpClient, url: string, params: HttpParams): Observable<PaginatedResult<T>> {
  const paginatedResult = new PaginatedResult<T>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map((response: HttpResponse<T>) => {
      paginatedResult.result = response.body;
      const paginationHeader = response.headers.get('Pagination');
      if (paginationHeader) {
        paginatedResult.pagination = JSON.parse(paginationHeader);
      }
      return paginatedResult;
    })
  );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}
