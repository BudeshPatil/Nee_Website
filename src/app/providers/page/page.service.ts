import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PageService {

	constructor(private http: HttpClient, private router: Router) { }

	getpageWithName = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/home/getpagewithName';
		return this.http
			.post(endpoint, moreData, { observe: 'response' as 'body' })
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getFooterDetails = (data: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/home/getFooterDetails';
		return this.http.post(endpoint, data).pipe(
			catchError((err) => {
				return throwError(err);
			})
		);
	};


}
