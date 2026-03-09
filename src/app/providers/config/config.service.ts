import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	constructor(private http: HttpClient) { }

	getTaxData = (data: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/config/getTax';
		return this.http.post(endpoint, data).pipe(
			catchError((err) => {
				return throwError(err);
			})
		);
	};

	getAllConfig = (data: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/config/getAllConfig';
		return this.http.post(endpoint, data).pipe(
			catchError((err) => {
				return throwError(err);
			})
		);
	};


	protected getRequestHeaders(): {
		headers: HttpHeaders | { [header: string]: string | string[] };
	} {
		let headers;
		const token = localStorage.getItem('neelgund-web-token');
		headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
		});
		return { headers: headers };
	}

}
