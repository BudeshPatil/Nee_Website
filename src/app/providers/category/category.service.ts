import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	getAllCategory = (data: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/category/getAllCategory';
		return this.http.post(endpoint, data).pipe(
			catchError((err) => {
				return throwError(err);
			})
		);
	};

	getSubCategory = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/subcategory/getallsubcategory';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getAllCollections = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collection/getAllCollection';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};
	getAllCategorycollections = (moreData: any): Observable<any> =>{
		const endpoint = environment.baseUrl + '/api/collectioncategory/getAllCollectionCategory';
		return this.http
		.post(endpoint, moreData)
		.pipe(
			catchError((err)=>{
				return throwError(err);
			})
		)
	}
}
