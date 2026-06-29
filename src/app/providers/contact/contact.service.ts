import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ContactService {

	constructor(private http: HttpClient, private router: Router) { }

	addContact = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/home/contactadd';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	addCareerForm = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/career/add';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};



	// Returns an observable
	upload(file: any): Observable<any> {
		// Create form data
		const formData = new FormData();

		// Store form name as "file" with file data
		formData.append('file', file, file.name);

		// Make http post request over api
		// with formData as req
		return this.http.post(environment.baseUrl + '/api/career/addNewDocument', formData);
	}

	addDownload = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/download/adddownload';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

}
